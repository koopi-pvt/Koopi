import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// POST - Create a new order with stock management
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      storeId,
      storeSlug,
      storeName,
      sellerId,
      sellerEmail,
      customerInfo,
      items,
      paymentMethod,
      subtotal,
      shipping = 0,
      tax = 0,
      total,
      notes,
      currency,
    } = body;

    // Validate required fields
    if (!storeId || !customerInfo || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json(
        { error: 'Database not initialized' },
        { status: 500 }
      );
    }

    // Generate order number
    const orderNumber = `KOP-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    // Use Firestore transaction to ensure stock consistency
    const result = await adminDb.runTransaction(async (transaction) => {
      // Step 1: Read and validate stock for all items
      const stockValidation = [];
      
      for (const item of items) {
        const productRef = adminDb.collection('products').doc(item.productId);
        const productDoc = await transaction.get(productRef);
        
        if (!productDoc.exists) {
          throw new Error(`Product ${item.productName} not found`);
        }
        
        const productData = productDoc.data();
        
        // Check if product tracks inventory
        if (productData?.inventoryTracked) {
          let availableStock = 0;
          
          // Check for variant-specific stock
          if (item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0) {
            // Find matching variant combination
            const variantCombinations = productData.variantCombinations || [];
            const matchingVariant = variantCombinations.find((combo: any) => {
              return Object.entries(item.selectedAttributes).every(
                ([key, value]) => combo.attributes[key] === value
              );
            });
            
            if (matchingVariant) {
              availableStock = matchingVariant.stock || 0;
              
              if (availableStock < item.quantity) {
                throw new Error(
                  `Insufficient stock for ${item.productName} (${Object.values(item.selectedAttributes).join(', ')}). Available: ${availableStock}, Requested: ${item.quantity}`
                );
              }
              
              stockValidation.push({
                productRef,
                productData,
                variantId: matchingVariant.id,
                requestedQuantity: item.quantity,
              });
            } else {
              throw new Error(`Variant not found for ${item.productName}`);
            }
          } else {
            // Simple product without variants
            availableStock = productData.quantity || 0;
            
            if (availableStock < item.quantity) {
              throw new Error(
                `Insufficient stock for ${item.productName}. Available: ${availableStock}, Requested: ${item.quantity}`
              );
            }
            
            stockValidation.push({
              productRef,
              productData,
              variantId: null,
              requestedQuantity: item.quantity,
            });
          }
        }
      }
      
      // Step 2: Create order document
      const orderData = {
        orderNumber,
        storeId,
        storeSlug: storeSlug || '',
        storeName: storeName || '',
        sellerId: sellerId || '',
        sellerEmail: sellerEmail || '',
        
        buyerId: customerInfo.buyerId || 'guest',
        buyerEmail: customerInfo.email,
        buyerName: customerInfo.name,
        
        items: items.map((item: any) => ({
          productId: item.productId,
          name: item.productName,
          image: item.image || '',
          price: item.price,
          quantity: item.quantity,
          variant: item.selectedAttributes || {},
          sku: item.sku || '',
        })),
        
        subtotal: subtotal || total,
        shipping: shipping,
        tax: tax,
        total,
        currency: currency || 'USD',
        
        shippingAddress: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          addressLine1: customerInfo.address,
          addressLine2: customerInfo.addressLine2 || '',
          city: customerInfo.city,
          state: customerInfo.state || '',
          zipCode: customerInfo.postalCode || '',
          country: customerInfo.country,
        },
        
        status: 'pending',
        paymentMethod: paymentMethod || 'cod',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'unpaid',
        
        notes: notes || '',
        
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };
      
      const orderRef = adminDb.collection('orders').doc();
      transaction.set(orderRef, orderData);
      
      // Step 3: Reduce stock for all validated items
      for (const validation of stockValidation) {
        const { productRef, productData, variantId, requestedQuantity } = validation;
        
        if (variantId) {
          // Update variant combination stock
          const variantCombinations = productData.variantCombinations || [];
          const updatedCombinations = variantCombinations.map((combo: any) => {
            if (combo.id === variantId) {
              return {
                ...combo,
                stock: combo.stock - requestedQuantity,
              };
            }
            return combo;
          });
          
          // Also update total quantity
          const totalStock = updatedCombinations.reduce(
            (sum: number, combo: any) => sum + (combo.stock || 0),
            0
          );
          
          transaction.update(productRef, {
            variantCombinations: updatedCombinations,
            quantity: totalStock,
            updatedAt: FieldValue.serverTimestamp(),
          });
        } else {
          // Update simple product stock
          transaction.update(productRef, {
            quantity: FieldValue.increment(-requestedQuantity),
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
      }
      
      return {
        orderId: orderRef.id,
        orderNumber,
      };
    });

    // TODO: Send order confirmation email to customer
    // TODO: Send order notification email to store owner

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      message: 'Order placed successfully',
    });

  } catch (error: any) {
    console.error('Error creating order:', error);
    
    // Return specific error messages for stock issues
    if (error.message && error.message.includes('Insufficient stock')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET - Fetch orders (for store owner)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json(
        { error: 'Database not initialized' },
        { status: 500 }
      );
    }

    const ordersSnapshot = await adminDb
      .collection('orders')
      .where('storeId', '==', storeId)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

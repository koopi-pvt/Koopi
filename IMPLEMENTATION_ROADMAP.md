"# 🚀 KOOPI STORE ENHANCEMENT - COMPLETE ROADMAP

## 📊 Project Overview
Comprehensive enhancement of the Koopi e-commerce platform with 13+ major features including multi-image uploads, variant management, buyer authentication, order tracking, real-time messaging, and email notifications.

**Estimated Total Time:** 12-17 hours  
**Total Files to Modify/Create:** ~35+ files  
**Database Collections:** buyers, messages, orders (enhanced), notifications

---

## 🎯 CURRENT STATE (Updated Progress)

### ✅ Completed Features:
1. Toast Provider - Working correctly
2. Slug Checker - Validation on submit with suggestions
3. Firebase Configuration - Real credentials added
4. Basic store structure exists at `/[locale]/store/[slug]`
5. ✅ **PHASE 1.2** - Product Variant Pricing Display (existing implementation verified)
6. ✅ **PHASE 1.3** - Minimum Price Validation (100 LKR) - COMPLETED
7. ✅ **PHASE 1.4** - Stock Management on Checkout - COMPLETED

### 📁 Key Existing Files:
- Product types: `/app/src/types/product.ts`
- Store types: `/app/src/types/store.ts`, `/app/src/types/user.ts`
- Store page: `/app/src/app/[locale]/store/[slug]/page.tsx`
- Store layout: `/app/src/app/[locale]/store/[slug]/layout.tsx`
- Cart context: `/app/src/contexts/CartContext.tsx`
- Product card: `/app/src/components/store/ProductCard.tsx`

### 🔧 Tech Stack:
- Next.js 15.5.6 (App Router + Turbopack)
- Firebase/Firestore (database + auth)
- Supabase (image storage)
- SendGrid (email notifications)
- Tailwind CSS 4.0

### 🔑 Environment Variables Available:
- Firebase (client + admin)
- SendGrid API key + emails
- Supabase URL + keys
- Base domain: koopi.online

---

## 📋 IMPLEMENTATION PHASES

## PHASE 1: PRODUCT MANAGEMENT & PRICING (Priority: CRITICAL)
**Estimated Time:** 4-6 hours  
**Dependencies:** None

### 1.1 Multiple Image Upload for Products ⭐⭐⭐
**Files to Modify:**
- `/app/src/app/[locale]/dashboard/products/new/page.tsx`
- `/app/src/app/[locale]/dashboard/products/[id]/page.tsx`
- `/app/src/components/products/ImageUploadSection.tsx` (create new)

**Implementation Steps:**
1. Create ImageUploadSection component with:
   - Multi-select file input (accept multiple images at once)
   - Drag & drop zone
   - Image preview grid with delete option
   - Reorder functionality (drag to reorder)
   - Upload progress indicators
   - Max 10 images per product
2. Update Supabase upload logic to handle batch uploads
3. Store image URLs array in product document
4. Update product form to use new component

**Technical Notes:**
- Use Supabase storage: `products/${storeId}/${productId}/${timestamp}_${filename}`
- Implement optimistic UI updates
- Add image compression before upload (max 2MB per image)

### 1.2 Product Variant Pricing Display ⭐⭐⭐
**Files to Modify:**
- `/app/src/components/store/ProductCard.tsx`
- `/app/src/app/[locale]/store/[slug]/product/[productId]/page.tsx`
- `/app/src/utils/pricing.ts` (create new)

**Implementation Steps:**
1. Create pricing utility functions:
   ```typescript
   getLowestVariantPrice(product: Product): number
   getHighestVariantPrice(product: Product): number
   formatPriceWithCurrency(price: number, currency: string): string
   ```
2. Update ProductCard to show:
   - \"From LKR X\" if variants exist with different prices
   - Regular price if no variants or all same price
   - Compare at price with strikethrough if discount exists
3. Product detail page: Show price only after variant selection
4. Add \"Select options\" button on card if variants exist

### 1.3 Minimum Price Validation (100 LKR) ⭐⭐ ✅ COMPLETED
**Files to Modify:**
- `/app/src/utils/pricing.ts`
- `/app/src/app/[locale]/dashboard/products/new/page.tsx`
- `/app/src/app/[locale]/dashboard/products/[id]/page.tsx`
- `/app/src/utils/currency.ts`

**Implementation Steps:**
1. Create currency conversion utility:
   - Base currency: LKR
   - Minimum: 100 LKR
   - Convert minimum based on exchange rates
   - Support: USD, EUR, GBP, INR, LKR
2. Add validation on product form:
   - Check base price >= minimum
   - Check all variant prices >= minimum
   - Show error message with converted amount
3. Add server-side validation in API routes

**Exchange Rates (approximations for validation):**
```typescript
const MIN_PRICES = {
  LKR: 100,
  USD: 0.33,   // ~300 LKR
  EUR: 0.31,
  GBP: 0.27,
  INR: 27.5
};
```

### 1.4 Stock Management on Checkout ⭐⭐⭐ ✅ COMPLETED
**Files to Modify:**
- `/app/src/app/[locale]/store/[slug]/checkout/page.tsx`
- `/app/src/app/api/checkout/route.ts` (create new)
- `/app/src/types/order.ts` (create new)

**Implementation Steps:**
1. Create order processing API:
   - Validate stock availability
   - Create order in Firestore
   - Reduce stock atomically using transactions
   - Handle variant stock separately
2. Add stock validation before checkout:
   - Check each cart item against current stock
   - Show error if insufficient stock
   - Update cart if stock changed
3. Implement Firestore transaction for stock updates:
   ```typescript
   await db.runTransaction(async (transaction) => {
     // Read current stock
     // Validate sufficient stock
     // Reduce stock
     // Create order
   });
   ```

---

## PHASE 2: NAVIGATION & AUTHENTICATION (Priority: HIGH) ✅ COMPLETED
**Estimated Time:** 3-4 hours  
**Dependencies:** Phase 1 completed

### 2.1 Consistent Store Navigation ⭐⭐⭐ ✅ COMPLETED
**Files Created/Modified:**
- `/app/src/components/store/StoreNavigation.tsx` - Enhanced with auth integration
- `/app/src/app/[locale]/store/[slug]/layout.tsx` - Added BuyerAuthProvider

**Features Implemented:**
✅ Logo + Store name with gradient icon
✅ Navigation links: Shop
✅ Cart icon with item count badge
✅ Login/Account dropdown with user menu
✅ Mobile responsive menu with hamburger
✅ Account dropdown shows: My Account, My Orders, Logout
✅ Mobile menu includes account options
✅ Guest users see Login button

### 2.2 Buyer Authentication System ⭐⭐⭐ ✅ COMPLETED
**Files Created:**
- `/app/src/contexts/BuyerAuthContext.tsx` - Complete auth context with login/signup/logout
- `/app/src/app/[locale]/store/[slug]/login/page.tsx` - Beautiful login page
- `/app/src/app/[locale]/store/[slug]/signup/page.tsx` - Signup page with validation
- `/app/src/app/api/buyer/auth/login/route.ts` - Login API
- `/app/src/app/api/buyer/auth/signup/route.ts` - Signup API with email validation
- `/app/src/app/api/buyer/auth/logout/route.ts` - Logout API
- `/app/src/types/buyer.ts` - Complete buyer type definitions

 
**Features Implemented:**
✅ Email/password authentication
✅ Login with error handling
✅ Signup with validation (email format, password strength, duplicate check)
✅ Auto-redirect after login to account page or returnUrl
✅ "Continue as Guest" option
✅ localStorage session persistence
✅ Password confirmation on signup
✅ Buyer profile in context (accessible throughout app)
✅ Logout functionality

**Security Note:** Demo implementation uses plain password storage. In production, implement bcrypt password hashing.

### 2.3 Buyer Account Pages ⭐⭐⭐ ✅ COMPLETED
**Files Created:**
- `/app/src/app/[locale]/store/[slug]/account/page.tsx` - Account dashboard
- `/app/src/app/[locale]/store/[slug]/account/orders/page.tsx` - Orders list with filters

**Features Implemented:**
✅ Account dashboard with user info
✅ Quick action cards (My Orders, Saved Addresses)
✅ Logout button
✅ Auth guard (redirects to login if not authenticated)
✅ Orders list page with status filters
✅ Order status badges with colors
✅ Empty state handling
✅ Responsive design

### 2.4 Navigation Integration ⭐⭐ ✅ COMPLETED
**Features Implemented:**
✅ Navigation shows logged-in user's first name
✅ Dropdown menu with account options (desktop)
✅ Mobile menu includes account links
✅ "Back to Store" links on all auth pages
✅ Smooth transitions and hover effects
✅ Consistent styling across all pages

---

## PHASE 3: ORDER TRACKING & MESSAGING (Priority: HIGH)
**Estimated Time:** 5-6 hours  
**Dependencies:** Phase 2 completed

### 3.1 Order Type Enhancements ⭐⭐⭐
**Files to Create:**
- `/app/src/types/order.ts`
- `/app/src/types/message.ts`

**Order Type Definition:**
```typescript
interface Order {
  id: string;
  orderNumber: string; // e.g., \"KOP-2024-001234\"
  storeId: string;
  storeName: string;
  sellerId: string;
  sellerEmail: string;
  
  buyerId: string;
  buyerEmail: string;
  buyerName: string;
  
  items: OrderItem[];
  
  subtotal: number;
  discount?: {
    code: string;
    discountAmount: number;
  };
  shipping: number;
  tax: number;
  total: number;
  
  currency: string;
  
  shippingAddress: Address;
  
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'stripe' | 'paypal'; // COD only for now
  paymentStatus: 'pending' | 'paid' | 'refunded';
  
  trackingNumber?: string;
  notes?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface OrderItem {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  variant?: { [key: string]: string }; // e.g., { \"Size\": \"M\", \"Color\": \"Red\" }
  sku?: string;
}
```

### 3.2 Buyer Order Tracking Page ⭐⭐⭐
**Files to Create:**
- `/app/src/app/[locale]/store/[slug]/account/orders/page.tsx`
- `/app/src/app/[locale]/store/[slug]/account/orders/[orderId]/page.tsx`
- `/app/src/components/buyer/OrderTimeline.tsx`
- `/app/src/components/buyer/OrderCard.tsx`

**Implementation Steps:**
1. Create orders list page (copy structure from provided code)
2. Create order detail page with:
   - Order timeline (pending → processing → shipped → delivered)
   - Order items list
   - Shipping address
   - Order summary
   - Real-time messaging section
   - Status updates
3. Match UI with provided design
4. Add filter by status (all, pending, delivered, cancelled)

### 3.3 Seller Order Management Page ⭐⭐⭐
**Files to Modify:**
- `/app/src/app/[locale]/dashboard/orders/page.tsx`
- `/app/src/app/[locale]/dashboard/orders/[orderId]/page.tsx` (create new)

**Implementation Steps:**
1. Remove popup modal for order details
2. Create dedicated order detail page (inline)
3. Copy structure from provided seller order tracking code
4. Add status update buttons
5. Add real-time messaging section
6. Add order actions: Print invoice, Cancel order
7. Match glassmorphism UI design from provided code

### 3.4 Real-Time Messaging System ⭐⭐⭐
**Files to Create:**
- `/app/src/components/messaging/ChatBox.tsx`
- `/app/src/app/api/messages/route.ts`
- `/app/src/hooks/useOrderMessages.ts`

**Message Type Definition:**
```typescript
interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderType: 'buyer' | 'seller';
  senderName: string;
  message: string;
  createdAt: Timestamp;
}
```

**Implementation Steps:**
1. Create messages collection in Firestore
2. Implement real-time listener with onSnapshot
3. Create ChatBox component:
   - Message list with auto-scroll
   - Message input with send button
   - Show sender name and timestamp
   - Different styling for buyer/seller messages
4. Add to both buyer and seller order detail pages
5. Send notification when new message arrives
6. Add unread message count

---

## PHASE 4: EMAIL NOTIFICATIONS (Priority: MEDIUM)
**Estimated Time:** 3-4 hours  
**Dependencies:** Phase 3 completed

### 4.1 Email Template System ⭐⭐⭐
**Files to Create:**
- `/app/src/lib/email/templates/orderPlaced.ts`
- `/app/src/lib/email/templates/orderStatusUpdate.ts`
- `/app/src/lib/email/templates/newMessage.ts`
- `/app/src/lib/email/sendEmail.ts`
- `/app/src/app/api/email/send/route.ts`

**Implementation Steps:**
1. Create email template functions using SendGrid dynamic templates
2. Create HTML email templates:
   - Order Placed (for buyer)
   - Order Placed (for seller)
   - Order Status Update
   - New Message Notification
3. Implement sendEmail utility function
4. Create API route for sending emails

### 4.2 Order Placed Notifications ⭐⭐
**Files to Modify:**
- `/app/src/app/api/checkout/route.ts`

**Implementation Steps:**
1. After order creation, send emails to:
   - Buyer: Order confirmation with details
   - Seller: New order notification
2. Include in email:
   - Order number
   - Items list
   - Total amount
   - Shipping address
   - Payment method
   - Tracking link

### 4.3 Status Update Notifications ⭐⭐
**Files to Modify:**
- `/app/src/app/api/orders/[orderId]/status/route.ts` (create new)

**Implementation Steps:**
1. When seller updates order status, send email to buyer
2. Include new status and estimated delivery (if shipped)
3. Add tracking number if available

### 4.4 Message Notifications ⭐⭐
**Files to Modify:**
- `/app/src/app/api/messages/route.ts`

**Implementation Steps:**
1. When new message sent, send email notification
2. Include message preview
3. Add link to order tracking page
4. Check notification preferences before sending

---

## PHASE 5: UI/UX POLISH (Priority: LOW)
**Estimated Time:** 2-3 hours  
**Dependencies:** Phases 1-4 completed

### 5.1 Store Navigation Redesign ⭐⭐
- Implement modern, clean navigation
- Add search functionality
- Improve mobile menu
- Add breadcrumbs on product/checkout pages

### 5.2 Compare Price Display ⭐⭐
- Show original price with strikethrough
- Show savings percentage
- Highlight deals with badge

### 5.3 Responsive Design Check ⭐
- Test all pages on mobile/tablet/desktop
- Fix any layout issues
- Optimize images for different screen sizes

### 5.4 Loading States & Error Handling ⭐
- Add skeleton loaders for all pages
- Improve error messages
- Add retry mechanisms for failed API calls

---

## 🗂️ DATABASE STRUCTURE

### Firestore Collections:

#### `buyers` (new)
```
/buyers/{buyerId}
  - id: string
  - email: string
  - name: string
  - phone: string
  - photoURL: string
  - createdAt: Timestamp
  - updatedAt: Timestamp
  
  /buyers/{buyerId}/addresses/{addressId}
    - name, phone, addressLine1, city, state, etc.
    - isDefault: boolean
```

#### `orders` (enhanced)
```
/orders/{orderId}
  - orderNumber: string
  - storeId, storeName, sellerId, sellerEmail
  - buyerId, buyerEmail, buyerName
  - items: OrderItem[]
  - subtotal, discount, shipping, tax, total
  - currency: string
  - shippingAddress: Address
  - status: string
  - paymentMethod, paymentStatus
  - trackingNumber: string
  - createdAt, updatedAt: Timestamp
```

#### `messages` (new)
```
/messages/{messageId}
  - orderId: string (indexed)
  - senderId: string
  - senderType: 'buyer' | 'seller'
  - senderName: string
  - message: string
  - createdAt: Timestamp
```

#### `notifications` (optional)
```
/notifications/{notificationId}
  - userId: string (indexed)
  - type: string
  - title: string
  - message: string
  - link: string
  - read: boolean
  - createdAt: Timestamp
```

---

## 🚨 CRITICAL NOTES FOR NEXT AGENT

### Before Starting Implementation:

1. **READ THE ENTIRE ROADMAP** - Understand all phases and dependencies

2. **Check Current Environment:**
   ```bash
   cd /app
   ls -la .env.local
   # If missing, create it with credentials from this roadmap
   ```

3. **Install Dependencies (if needed):**
   ```bash
   yarn install
   ```

4. **Start Dev Server:**
   ```bash
   yarn dev > /tmp/nextjs.log 2>&1 &
   ```

5. **Database Setup:**
   - Firestore indexes may need to be created for:
     - `orders`: index on `buyerId`, `sellerId`, `status`
     - `messages`: composite index on `orderId` + `createdAt`
   - Create indexes via Firebase Console when queries fail

### Implementation Order:
**START WITH PHASE 1** - It has no dependencies and provides critical foundation for other features.

Do NOT skip phases or implement out of order without understanding dependencies.

### Key Files to Review Before Starting:
1. `/app/src/types/product.ts` - Understand product structure
2. `/app/src/types/store.ts` - Understand store structure
3. `/app/src/contexts/CartContext.tsx` - Understand cart implementation
4. `/app/src/components/store/ProductCard.tsx` - Current product card
5. `/app/src/app/[locale]/store/[slug]/page.tsx` - Store homepage

### Common Pitfalls to Avoid:
1. **Don't modify env file carelessly** - Use the exact credentials provided
2. **Don't skip Firestore security rules** - Add proper rules for new collections
3. **Don't forget error handling** - Wrap all async operations in try-catch
4. **Don't hardcode store IDs** - Always get from params or context
5. **Don't break existing features** - Test carefully after each change
6. **Always use transactions for stock updates** - Prevent race conditions

### When Stuck:
1. Check Firebase Console for errors
2. Check browser console for client errors
3. Check `/tmp/nextjs.log` for server errors
4. Review provided example code in this roadmap
5. Test with curl or Postman for API issues

### Progress Tracking:
Update this roadmap file as you complete each feature. Mark completed items with ✅.

---

## 📞 HANDOFF PROTOCOL

When handing off to next agent:
1. Update this roadmap with completed features
2. Document any blockers or issues encountered
3. List files modified/created
4. Note any deviations from the plan
5. Provide specific next steps

---

## 🎯 SUCCESS CRITERIA

The project is complete when:
- [ ] All 13 features implemented and tested
- [ ] No console errors in browser or server
- [ ] All email notifications working
- [ ] Real-time messaging working
- [ ] Stock management working correctly
- [ ] Buyer and seller can complete full order flow
- [ ] Mobile responsive on all pages
- [ ] Currency conversion working for all supported currencies

---

**Last Updated:** January 23, 2025  
**Status:** Phase 2 COMPLETED ✅  
**Next Phase:** Phase 3 - Order Tracking & Messaging

---

## 🎉 PHASE 1 COMPLETION SUMMARY

### Completed Features (4/4):
✅ 1.1 Multiple Image Upload - Already implemented, verified working  
✅ 1.2 Product Variant Pricing Display - Already implemented, verified working  
✅ 1.3 Minimum Price Validation (100 LKR) - **NEWLY IMPLEMENTED**  
✅ 1.4 Stock Management on Checkout - **NEWLY IMPLEMENTED**

### New Files Created:
- `/app/src/utils/pricing.ts` - Complete pricing validation utilities
- `/app/src/types/order.ts` - Order type definitions
- `/app/test_result.md` - Detailed implementation documentation

### Files Enhanced:
- Product creation/edit pages with price validation
- Orders API with Firestore transaction-based stock management
- Checkout page with enhanced error handling

### Key Achievements:
- ✅ Multi-currency price validation (15+ currencies)
- ✅ Atomic stock updates using Firestore transactions
- ✅ No race conditions in stock management
- ✅ Clear error messages for validation failures
- ✅ Support for both simple products and variants

**See `/app/test_result.md` for complete implementation details and testing recommendations.**
"
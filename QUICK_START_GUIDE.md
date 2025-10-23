# 🚀 Quick Start Guide for Next Agent

## ⚡ Fast Track - Get Started in 5 Minutes

### 1️⃣ Environment Check
```bash
# Verify server is running
ps aux | grep "next dev"

# If not running, start it
cd /app && yarn dev > /tmp/nextjs.log 2>&1 &

# Check logs
tail -f /tmp/nextjs.log
```

### 2️⃣ Key Files to Read First
1. `/app/test_result.md` - Complete implementation status (READ THIS FIRST!)
2. `/app/IMPLEMENTATION_ROADMAP.md` - Feature roadmap (5 phases)
3. `/app/.env.local` - Environment variables (already configured)

### 3️⃣ Test the App
```bash
# Open in browser
http://localhost:3000

# Try creating a store account
http://localhost:3000/en/signup

# Access dashboard (after login)
http://localhost:3000/en/dashboard

# View a store frontend (replace [slug])
http://localhost:3000/en/store/[slug]
```

---

## 📍 Current State Summary

**✅ COMPLETED: Phase 1 (4/4 features)**
- Multiple image upload
- Variant pricing display
- Minimum price validation (100 LKR)
- Stock management with Firestore transactions

**🎯 NEXT: Phase 2 OR Testing Phase 1**
- Phase 2: Navigation & Authentication (3-4 hours)
- Testing: Invoke backend testing agent

---

## 🗺️ Project Navigation

### Most Important Directories:
```
/app/src/app/[locale]/dashboard/products/  → Product management
/app/src/app/[locale]/store/[slug]/        → Store frontend
/app/src/app/api/                          → Backend APIs
/app/src/components/                       → Reusable components
/app/src/types/                            → TypeScript types
/app/src/utils/                            → Utility functions
```

### Most Edited Files (Phase 1):
1. `/app/src/utils/pricing.ts` - NEW - Price validation
2. `/app/src/types/order.ts` - NEW - Order types
3. `/app/src/app/api/orders/route.ts` - ENHANCED - Stock management
4. `/app/src/app/[locale]/dashboard/products/new/page.tsx` - ENHANCED
5. `/app/src/app/[locale]/dashboard/products/[id]/page.tsx` - ENHANCED

---

## 🔧 Common Tasks

### Create a New API Route
```bash
# Create file
mkdir -p /app/src/app/api/your-feature
touch /app/src/app/api/your-feature/route.ts

# Template
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Your logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### Create a New Page
```bash
# Create file
mkdir -p /app/src/app/[locale]/your-page
touch /app/src/app/[locale]/your-page/page.tsx

# Template
'use client';

export default function YourPage() {
  return (
    <div>
      <h1>Your Page</h1>
    </div>
  );
}
```

### Add a New Type
```bash
# Edit existing or create new file in /app/src/types/

export interface YourType {
  id: string;
  name: string;
  createdAt: any;
}
```

### Query Firestore
```typescript
// Server-side (API routes)
import { adminDb } from '@/lib/firebase-admin';

const snapshot = await adminDb
  .collection('products')
  .where('storeId', '==', storeId)
  .get();

const products = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### Upload to Supabase
```typescript
import { uploadImageToSupabase } from '@/lib/supabase';

const fileBuffer = Buffer.from(await file.arrayBuffer());
const fileName = `path/${uuid}.${ext}`;

const { url } = await uploadImageToSupabase(
  fileBuffer,
  fileName,
  file.type,
  true // Use admin client
);
```

---

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill existing process
kill -9 <PID>

# Clear node_modules and reinstall
rm -rf node_modules
yarn install

# Restart
yarn dev
```

### Build Errors
```bash
# Check Next.js logs
tail -100 /tmp/nextjs.log

# Common issues:
# - Missing dependencies: yarn install
# - TypeScript errors: Check for 'any' types
# - Import errors: Check file paths
```

### Database Errors
```bash
# Verify Firebase config
cat /app/.env.local | grep FIREBASE

# Check Firestore rules in Firebase Console
# Make sure collections are created
```

### Image Upload Fails
```bash
# Verify Supabase config
cat /app/.env.local | grep SUPABASE

# Check bucket exists in Supabase console
# Bucket name: 'products' (must be public)
```

---

## 📊 Database Quick Reference

### Collections:
- `stores` - Store information
- `products` - Product catalog
- `orders` - Customer orders
- `users` - Store owners
- `storeSlugs` - Slug tracking

### Common Queries:
```typescript
// Get store by ID
const storeDoc = await adminDb.collection('stores').doc(storeId).get();

// Get store by slug
const slugDoc = await adminDb.collection('storeSlugs').doc(slug).get();
const storeId = slugDoc.data()?.storeId;

// Get products for store
const products = await adminDb
  .collection('products')
  .where('storeId', '==', storeId)
  .where('status', '==', 'Active')
  .get();

// Get orders for store
const orders = await adminDb
  .collection('orders')
  .where('storeId', '==', storeId)
  .orderBy('createdAt', 'desc')
  .limit(50)
  .get();
```

---

## 🎨 UI Component Reference

### Toast Notifications
```typescript
import { useToast } from '@/contexts/ToastContext';

const toast = useToast();
toast.success('Success message');
toast.error('Error message');
toast.warning('Warning message');
```

### Cart
```typescript
import { useCart } from '@/contexts/CartContext';

const { cart, addToCart, removeFromCart, clearCart } = useCart();
addToCart(product, quantity, selectedAttributes);
```

### User Context
```typescript
import { useUser } from '@/contexts/UserContext';

const { user, store, loading } = useUser();
```

### Currency Formatting
```typescript
import { formatPrice, getCurrencySymbol } from '@/utils/currency';

formatPrice(100, 'USD')  // "$100.00"
getCurrencySymbol('EUR')  // "€ "
```

### Price Validation
```typescript
import { validateProductPrices, getMinimumPrice } from '@/utils/pricing';

const validation = validateProductPrices(price, variants, currency);
if (!validation.isValid) {
  validation.errors.forEach(err => console.log(err));
}
```

---

## 📋 Phase 2 Quick Setup (When Ready)

### Features to Implement:
1. **Buyer Authentication** (~2 hours)
   - Create `/app/src/contexts/BuyerAuthContext.tsx`
   - Add `/app/src/app/[locale]/store/[slug]/login/page.tsx`
   - Add `/app/src/app/[locale]/store/[slug]/signup/page.tsx`
   - Create buyers collection in Firestore

2. **Store Navigation** (~1 hour)
   - Enhance `/app/src/components/store/StoreNavigation.tsx`
   - Add to all store pages
   - Mobile menu

3. **Order Tracking** (~1 hour)
   - Create `/app/src/app/[locale]/store/[slug]/account/orders/page.tsx`
   - Show order list and details

4. **Auth-Required Checkout** (~30 min)
   - Update checkout page to check authentication
   - Show login modal if not authenticated

### Files to Create:
```
/app/src/contexts/BuyerAuthContext.tsx
/app/src/app/[locale]/store/[slug]/login/page.tsx
/app/src/app/[locale]/store/[slug]/signup/page.tsx
/app/src/app/[locale]/store/[slug]/account/orders/page.tsx
/app/src/app/[locale]/store/[slug]/account/orders/[orderId]/page.tsx
/app/src/app/api/buyer/auth/route.ts
/app/src/types/buyer.ts
```

---

## 🧪 Testing Checklist

### Before Testing:
- [ ] Server running
- [ ] No console errors
- [ ] All files saved
- [ ] TypeScript compiles

### Testing Commands:
```bash
# Backend testing
# Use deep_testing_backend_v2 tool with detailed task description

# Frontend testing  
# Use auto_frontend_testing_agent tool with test scenarios

# Manual testing
# Open browser and follow test cases in test_result.md
```

---

## 💡 Pro Tips

1. **Always check test_result.md first** - It has the latest state
2. **Use bulk_file_writer for multiple files** - Faster than one by one
3. **Read existing code before creating new** - Avoid duplication
4. **Follow existing patterns** - Keep consistency
5. **Update test_result.md as you go** - Don't wait until the end
6. **Test incrementally** - Don't build everything then test
7. **Use transactions for stock updates** - Already implemented, follow the pattern
8. **Validate on both client and server** - Security best practice

---

## 📞 When Stuck

1. **Check logs:** `tail -100 /tmp/nextjs.log`
2. **Review existing code:** Similar features already implemented
3. **Read test_result.md:** Detailed explanations and patterns
4. **Check Firebase Console:** Verify data structure
5. **Use troubleshoot_agent:** For persistent errors
6. **Web search:** For Next.js 15/React 19 specific issues

---

## ✅ Pre-Flight Checklist

Before starting any work:
- [ ] Read test_result.md completely
- [ ] Understand current phase status
- [ ] Server is running
- [ ] Environment variables configured
- [ ] Tested basic functionality
- [ ] Have clear objective for session

During work:
- [ ] Save files frequently
- [ ] Test changes incrementally  
- [ ] Update documentation
- [ ] Commit logical chunks (mental note)
- [ ] Handle errors gracefully

Before finishing:
- [ ] All features tested
- [ ] Documentation updated
- [ ] No console errors
- [ ] Server still running
- [ ] test_result.md reflects current state

---

**Remember: Quality > Speed. Take time to understand before implementing.**

**Good luck! 🚀**

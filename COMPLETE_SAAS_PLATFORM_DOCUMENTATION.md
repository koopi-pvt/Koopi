
# SHOPIFY-LIKE SAAS E-COMMERCE PLATFORM FOR SRI LANKA
## Complete Technical & Business Documentation

**Project:** Multi-Tenant E-Commerce SaaS Platform  
**Target Market:** Sri Lanka + South Asia  
**Technology:** Supabase, React.js, Node.js, PostgreSQL  
**Timeline:** 26-30 weeks to MVP  
**Investment:** $60,000 - $199,000  
**Status:** Planning & Development Roadmap

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Market Opportunity](#market-opportunity)
3. [Platform Overview](#platform-overview)
4. [Complete Development Roadmap](#complete-development-roadmap)
5. [Technology Stack](#technology-stack)
6. [Database Schema](#database-schema)
7. [Row Level Security Implementation](#row-level-security)
8. [API Endpoints](#api-endpoints)
9. [Page Structure & Workflow](#page-structure--workflow)
10. [Registration & Onboarding Flow](#registration--onboarding-flow)
11. [Team Structure](#team-structure)
12. [Financial Planning](#financial-planning)
13. [Risk Management](#risk-management)
14. [Success Metrics](#success-metrics)

---

## EXECUTIVE SUMMARY

This document provides complete technical specifications for building a **Shopify-like SaaS platform tailored for Sri Lankan merchants**. The platform enables entrepreneurs to create professional online stores without technical expertise, with built-in support for local payment gateways (PayHere, Sampath Bank IPG, Commercial Bank).

### Key Differentiators
- **Local Payment Integration:** PayHere, Sampath Bank, Commercial Bank
- **Regional Focus:** Optimized for South Asian markets
- **Cost-Effective:** 30-50% cheaper than Shopify
- **Complete Solution:** Hosting, domain, support included
- **Multi-Tenant Architecture:** Secure data isolation with Row Level Security

### Target Metrics (Year 1)
- 500 active stores
- LKR 100M in transaction volume
- 95% uptime SLA
- <2s page load time
- $50,000+ monthly recurring revenue

---

## MARKET OPPORTUNITY

### Sri Lanka E-Commerce Landscape
- **Total Market Size:** $4B+ annually
- **Growth Rate:** 25% YoY
- **Digital Payment Infrastructure:** 17 trillion LKR in real-time transactions
- **Target Market:** 50,000+ SMEs without online presence
- **Digital Payment Adoption:** Growing rapidly, especially post-COVID

### Competitive Analysis
| Platform | Local Payment | Pricing (LKR) | Target Market |
|----------|---------------|---------------|---------------|
| Shopify | No | 5,000+/mo | Premium |
| WooCommerce | Yes | 2,000+/mo | Developers |
| **Your Platform** | Yes | 1,000-2,000/mo | SMEs |

### Go-To-Market Strategy

**Phase 1 (Months 1-3):** Beta launch with 50-100 pilot merchants
**Phase 2 (Months 4-6):** Scale to 500 merchants, focus on local partnerships
**Phase 3 (Months 7-12):** Regional expansion to Bangladesh, Pakistan

---

## PLATFORM OVERVIEW

### What is the Platform?

A **SaaS e-commerce platform** that allows merchants to:
1. Create professional online stores (no coding required)
2. Manage products, inventory, and orders
3. Accept payments via local and international gateways
4. Access analytics and reporting
5. Customize appearance with themes
6. Manage team members

### Who Are the Users?

**Primary Users:**
- Small business owners (1-10 employees)
- Retail store owners going online
- Entrepreneurs launching new ventures
- Digital agencies managing client stores

**Secondary Users:**
- Store staff (order fulfillment)
- Accountants (viewing reports)
- Marketing managers (analytics)

### Business Model

**Revenue Streams:**
1. **Subscription Plans** (Primary - 70% of revenue)
   - Basic: LKR 1,000/month (100 products, 1 user)
   - Professional: LKR 2,500/month (unlimited, 5 users)
   - Enterprise: LKR 5,000/month (custom features, dedicated support)

2. **Transaction Fees** (Secondary - 20% of revenue)
   - 1.5% of each payment processed (above base plan)
   - PayHere integration fee: 2-3%

3. **App Marketplace** (Tertiary - 10% of revenue)
   - Commission on third-party apps
   - Premium integrations

**Unit Economics (Year 1)**
- CAC (Customer Acquisition Cost): LKR 15,000
- LTV (Lifetime Value): LKR 360,000 (3-year average)
- Payback Period: 2 months

---

## COMPLETE DEVELOPMENT ROADMAP

### Phase 1: Discovery & Planning (Weeks 1-4)

#### Week 1-2: Research & Strategy
- ✅ Market research and competitor analysis
- ✅ Define product vision and MVP scope
- ✅ Identify target customer personas
- ✅ Create feature prioritization matrix
- ✅ Budget allocation and resource planning

**Deliverables:**
- Market analysis report
- Product vision document
- Feature roadmap (prioritized)
- Team structure plan
- Project budget breakdown

#### Week 3-4: Technical Planning
- ✅ Define technology stack
- ✅ Create system architecture diagrams
- ✅ API specification design
- ✅ Database schema planning
- ✅ Security & compliance framework

**Deliverables:**
- Tech stack documentation
- Architecture diagrams
- API specifications (OpenAPI/Swagger)
- Database schema diagrams
- Security compliance checklist

---

### Phase 2: Design & Architecture (Weeks 5-8)

#### Week 5-6: UI/UX Design
- ✅ Create wireframes for all pages
- ✅ Design interactive prototypes
- ✅ Build high-fidelity mockups
- ✅ Create design system (colors, typography, components)
- ✅ Test accessibility (WCAG 2.1 AA)

**Design Deliverables:**
- Figma design files (all pages)
- Component library
- Design system documentation
- Prototype with interactions
- Mobile & tablet versions

**Pages to Design (40 total):**
- Public: Landing, pricing, blog, login, register, storefront (6 pages + merchant storefronts)
- Admin: Dashboard, products, orders, customers, inventory, settings, analytics, etc. (27 pages)

#### Week 7-8: Architecture & Infrastructure
- ✅ Set up Supabase project
- ✅ Design multi-tenant architecture
- ✅ Plan Row Level Security policies
- ✅ Create database schema
- ✅ Plan API structure (REST endpoints)
- ✅ Set up development environment

**Technical Deliverables:**
- Supabase project initialized
- Database schema SQL files
- RLS policies SQL files
- Development environment configured
- CI/CD pipeline initial setup

---

### Phase 3: MVP Development (Weeks 9-20)

#### Week 9-11: Core Infrastructure
- ✅ Set up authentication system
- ✅ Implement JWT token handling
- ✅ Create user registration & login
- ✅ Build tenant creation flow
- ✅ Set up role-based access control

**Backend Components:**
```
/api/v1/auth
  - POST /signup (create tenant + user)
  - POST /login
  - POST /logout
  - GET /user (current user profile)
  - POST /refresh-token
```

**Frontend Components:**
- Registration page (4-step wizard)
- Login page
- Forgot password flow
- Email verification
- Onboarding tour

#### Week 12-14: Product Management
- ✅ Product CRUD operations
- ✅ Variant management
- ✅ Category management
- ✅ Image upload & optimization
- ✅ Bulk product operations
- ✅ Search & filtering

**Backend APIs:**
```
/api/v1/products
  - GET /products (list with pagination)
  - GET /products/{id} (detail)
  - POST /products (create)
  - PATCH /products/{id} (update)
  - DELETE /products/{id}
  - POST /products/{id}/variants
  - PATCH /variants/{id}
  - POST /products/bulk-upload

/api/v1/categories
  - GET /categories
  - POST /categories
  - PATCH /categories/{id}
  - DELETE /categories/{id}
```

**Frontend Pages:**
- Products list page (search, filter, sort)
- Product detail/edit page
- Bulk upload page
- Categories manager
- Image gallery

#### Week 15-17: Orders & Checkout
- ✅ Cart functionality
- ✅ Checkout flow
- ✅ Order creation & management
- ✅ Order status tracking
- ✅ Fulfillment management
- ✅ Inventory updates on purchase

**Backend APIs:**
```
/api/v1/orders
  - POST /orders (create)
  - GET /orders (list)
  - GET /orders/{id} (detail)
  - PATCH /orders/{id} (update status)
  - POST /orders/{id}/cancel
  - POST /orders/{id}/fulfillments

/api/v1/customers
  - POST /customers (create/register)
  - GET /customers (list)
  - GET /customers/{id} (detail)
  - PATCH /customers/{id}
  - GET /customers/{id}/orders
```

**Frontend Pages:**
- Shopping cart
- Checkout (guest + registered customer)
- Order confirmation
- Order tracking (customer)
- Orders list (admin)
- Order detail (admin)

#### Week 18-20: Payment Processing
- ✅ PayHere integration
- ✅ Stripe integration
- ✅ PayPal integration
- ✅ Webhook handling for confirmations
- ✅ Refund processing
- ✅ Transaction history

**Backend APIs:**
```
/api/v1/payments
  - POST /payments/process
  - GET /orders/{id}/transactions
  - POST /payments/{id}/refund
  - POST /webhooks/payhere
  - POST /webhooks/stripe
  - POST /webhooks/paypal
```

**Frontend Components:**
- Payment method selection
- Payment processing flow
- Transaction history display

---

### Phase 4: Testing & QA (Weeks 21-24)

#### Week 21-22: Functional Testing
- ✅ Test all CRUD operations
- ✅ User workflows end-to-end
- ✅ Cross-browser testing (Chrome, Firefox, Safari, Edge)
- ✅ Mobile responsiveness testing
- ✅ API contract testing

**Test Coverage Target:** 80% code coverage

#### Week 22-23: Performance & Security
- ✅ Load testing (1000+ concurrent users)
- ✅ Database query optimization
- ✅ Penetration testing
- ✅ Security audit
- ✅ PCI DSS compliance verification
- ✅ GDPR compliance check

**Performance Targets:**
- Page load time: <2 seconds (core pages)
- API response time: <500ms (p95)
- Database query time: <100ms (p95)

#### Week 24: User Acceptance Testing
- ✅ Beta testing with 50-100 pilot users
- ✅ Collect feedback
- ✅ Fix critical bugs
- ✅ Performance monitoring

---

### Phase 5: Launch & Deployment (Weeks 25-26)

#### Week 25: Final Preparation
- ✅ Production environment setup
- ✅ Database migration to production
- ✅ SSL certificates configured
- ✅ Backup systems tested
- ✅ Monitoring & alerting setup
- ✅ Documentation finalized
- ✅ Support team training

#### Week 26: Public Launch
- ✅ Deploy to production
- ✅ Activate monitoring
- ✅ Launch marketing campaign
- ✅ Customer support go-live
- ✅ Press release distribution

**Launch Checklist:**
- All 40 pages live
- Payment gateways processing
- Email notifications working
- Analytics tracking
- Support ticket system active
- Documentation published

---

### Phase 6: Post-Launch & Growth (Weeks 27+)

#### Months 2-3: Stabilization & Optimization
- 🔄 Monitor KPIs daily
- 🔄 Fix bugs reported by users
- 🔄 Performance optimization
- 🔄 Customer support scaling
- 🔄 Onboarding improvements

#### Months 4-6: Feature Development
- 📈 Advanced analytics
- 📈 Mobile app (iOS/Android)
- 📈 Marketing automation
- 📈 Multi-channel selling (social media, marketplaces)
- 📈 API for third-party integrations

#### Months 7-12: Expansion
- 🌍 Regional expansion (Bangladesh, Pakistan)
- 🌍 Additional payment gateways
- 🌍 B2B features (wholesale, dropshipping)
- 🌍 Marketplace features (multi-vendor)

---

## TECHNOLOGY STACK

### Frontend

**Primary Stack:**
- **Framework:** React.js 18+ or Next.js 14+
- **Styling:** Tailwind CSS
- **UI Components:** Headless UI / Radix UI
- **State Management:** Redux / Zustand
- **HTTP Client:** Axios / React Query (TanStack Query)
- **Forms:** React Hook Form / Formik
- **Charts:** Chart.js / Recharts
- **Build Tool:** Vite or Next.js built-in

**Key Libraries:**
```json
{
  "react": "^18.2.0",
  "next": "^14.0.0",
  "tailwindcss": "^3.3.0",
  "@supabase/supabase-js": "^2.33.0",
  "@tanstack/react-query": "^5.0.0",
  "react-hook-form": "^7.45.0",
  "recharts": "^2.8.0",
  "zustand": "^4.4.0"
}
```

**Deployment:** Vercel / Netlify for frontend

### Backend

**Primary Stack:**
- **Runtime:** Node.js 18+ (LTS)
- **Framework:** Express.js / Fastify
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (JWT)
- **API Style:** RESTful API (with GraphQL optional)
- **Validation:** Joi / Zod
- **Logging:** Winston / Pino

**Key Libraries:**
```json
{
  "express": "^4.18.0",
  "supabase": "^2.33.0",
  "@supabase/supabase-js": "^2.33.0",
  "joi": "^17.11.0",
  "zod": "^3.22.0",
  "winston": "^3.10.0",
  "dotenv": "^16.3.0",
  "cors": "^2.8.5",
  "helmet": "^7.1.0"
}
```

**Deployment:** 
- AWS EC2 / Heroku / Railway / DigitalOcean
- Docker containerization
- PM2 for process management

### Infrastructure & DevOps

- **Cloud Hosting:** AWS / Google Cloud / DigitalOcean
- **Database:** Supabase (PostgreSQL managed)
- **Storage:** AWS S3 / Supabase Storage
- **CDN:** Cloudflare / AWS CloudFront
- **DNS:** Route 53 / Cloudflare
- **CI/CD:** GitHub Actions / GitLab CI
- **Monitoring:** Datadog / New Relic / AWS CloudWatch
- **Error Tracking:** Sentry
- **Container:** Docker / Kubernetes (for scaling)

### Development Tools

- **Version Control:** Git / GitHub / GitLab
- **Package Manager:** npm / yarn / pnpm
- **API Testing:** Postman / Insomnia
- **Database GUI:** DBeaver / pgAdmin
- **Local Dev:** Docker Compose for local stack
- **Code Quality:** ESLint / Prettier / SonarQube
- **Testing:** Jest / Vitest / Playwright / Cypress

---

## DATABASE SCHEMA

### Overview

The database is designed with **multi-tenant architecture** where every table includes `tenant_id` to ensure complete data isolation. Uses PostgreSQL with Row Level Security (RLS) enforced by Supabase.

### Core Tables

#### 1. Authentication & Tenants

```sql
-- Supabase auth table (managed by Supabase)
auth.users (
  id UUID,
  email VARCHAR,
  encrypted_password VARCHAR,
  email_confirmed_at TIMESTAMP,
  raw_user_meta_data JSONB,
  app_metadata JSONB,  -- Contains { tenant_id: UUID, role: VARCHAR }
  created_at TIMESTAMP
)

-- Your database tables
tenants (
  id UUID PRIMARY KEY,
  name VARCHAR(255),           -- Store name
  subdomain VARCHAR(100) UNIQUE,
  custom_domain VARCHAR(255),
  plan_type VARCHAR(50),       -- trial, basic, professional, enterprise
  status VARCHAR(50),          -- active, suspended
  trial_ends_at TIMESTAMP,
  settings JSONB,              -- {"currency": "LKR", "timezone": "Asia/Colombo", ...}
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

user_roles (
  id UUID PRIMARY KEY,
  user_id UUID,                -- FK to auth.users
  tenant_id UUID,              -- FK to tenants
  role VARCHAR(50),            -- owner, admin, staff, developer
  permissions JSONB,           -- Custom permissions
  created_at TIMESTAMP
)
```

#### 2. Products & Inventory

```sql
products (
  id UUID PRIMARY KEY,
  tenant_id UUID,              -- Multi-tenant isolation
  title VARCHAR(500),
  slug VARCHAR(500),
  description TEXT,
  product_type VARCHAR(100),   -- physical, digital, service
  vendor VARCHAR(255),
  status VARCHAR(50),          -- draft, active, archived
  published_at TIMESTAMP,
  tags TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

product_variants (
  id UUID PRIMARY KEY,
  product_id UUID,             -- FK to products
  tenant_id UUID,
  sku VARCHAR(255),
  title VARCHAR(255),
  price DECIMAL(10, 2),
  compare_at_price DECIMAL(10, 2),
  cost_per_item DECIMAL(10, 2),
  inventory_quantity INTEGER,
  requires_shipping BOOLEAN,
  weight DECIMAL(10, 2),
  image_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

product_images (
  id UUID PRIMARY KEY,
  product_id UUID,
  tenant_id UUID,
  url TEXT,
  alt_text VARCHAR(500),
  position INTEGER,
  created_at TIMESTAMP
)

categories (
  id UUID PRIMARY KEY,
  tenant_id UUID,
  name VARCHAR(255),
  slug VARCHAR(255),
  description TEXT,
  parent_id UUID,              -- For hierarchical categories
  image_url TEXT,
  sort_order INTEGER,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

inventory_locations (
  id UUID PRIMARY KEY,
  tenant_id UUID,
  name VARCHAR(255),           -- "Main Warehouse", "Colombo Store"
  address1 VARCHAR(500),
  city VARCHAR(100),
  is_active BOOLEAN,
  created_at TIMESTAMP
)

inventory_levels (
  variant_id UUID,
  location_id UUID,
  tenant_id UUID,
  available INTEGER,           -- Available stock
  updated_at TIMESTAMP
)

inventory_adjustments (
  id UUID PRIMARY KEY,
  variant_id UUID,
  location_id UUID,
  tenant_id UUID,
  quantity_change INTEGER,
  reason VARCHAR(100),         -- sold, received, damaged, correction
  note TEXT,
  created_by UUID,             -- FK to auth.users
  created_at TIMESTAMP
)
```

#### 3. Customers & Orders

```sql
customers (
  id UUID PRIMARY KEY,
  tenant_id UUID,
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  accepts_marketing BOOLEAN,
  total_spent DECIMAL(10, 2),
  orders_count INTEGER,
  tags TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

customer_addresses (
  id UUID PRIMARY KEY,
  customer_id UUID,
  tenant_id UUID,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  address1 VARCHAR(500),
  address2 VARCHAR(500),
  city VARCHAR(100),
  zip VARCHAR(20),
  country VARCHAR(100),
  is_default BOOLEAN,
  created_at TIMESTAMP
)

orders (
  id UUID PRIMARY KEY,
  tenant_id UUID,
  order_number VARCHAR(50) UNIQUE,
  customer_id UUID,

  -- Status fields
  status VARCHAR(50),          -- pending, paid, fulfilled, cancelled
  financial_status VARCHAR(50),
  fulfillment_status VARCHAR(50),

  -- Pricing
  subtotal_price DECIMAL(10, 2),
  total_tax DECIMAL(10, 2),
  total_discounts DECIMAL(10, 2),
  total_shipping DECIMAL(10, 2),
  total_price DECIMAL(10, 2),
  currency VARCHAR(10),        -- LKR, USD

  -- Customer info
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),

  -- Addresses
  shipping_address JSONB,
  billing_address JSONB,

  -- Metadata
  note TEXT,
  tags TEXT[],
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

order_items (
  id UUID PRIMARY KEY,
  order_id UUID,
  tenant_id UUID,
  product_id UUID,
  variant_id UUID,
  title VARCHAR(500),
  sku VARCHAR(255),
  quantity INTEGER,
  price DECIMAL(10, 2),
  total_discount DECIMAL(10, 2),
  fulfillment_status VARCHAR(50),
  created_at TIMESTAMP
)

order_fulfillments (
  id UUID PRIMARY KEY,
  order_id UUID,
  tenant_id UUID,
  status VARCHAR(50),
  tracking_company VARCHAR(255),
  tracking_number VARCHAR(255),
  tracking_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### 4. Payments & Discounts

```sql
payment_transactions (
  id UUID PRIMARY KEY,
  order_id UUID,
  tenant_id UUID,
  amount DECIMAL(10, 2),
  currency VARCHAR(10),
  kind VARCHAR(50),            -- sale, refund, authorization
  status VARCHAR(50),          -- pending, success, failure
  gateway VARCHAR(100),        -- payhere, stripe, paypal, sampath_ipg
  gateway_transaction_id VARCHAR(255),
  error_code VARCHAR(50),
  error_message TEXT,
  processed_at TIMESTAMP,
  created_at TIMESTAMP
)

discount_codes (
  id UUID PRIMARY KEY,
  tenant_id UUID,
  code VARCHAR(100) UNIQUE,
  value_type VARCHAR(50),      -- percentage, fixed_amount
  value DECIMAL(10, 2),
  applies_to VARCHAR(50),      -- all, specific_products, collections
  minimum_purchase_amount DECIMAL(10, 2),
  usage_limit INTEGER,
  usage_count INTEGER,
  once_per_customer BOOLEAN,
  starts_at TIMESTAMP,
  ends_at TIMESTAMP,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### 5. Analytics & Customization

```sql
analytics_events (
  id UUID PRIMARY KEY,
  tenant_id UUID,
  event_type VARCHAR(100),     -- page_view, product_view, add_to_cart, purchase
  customer_id UUID,
  product_id UUID,
  order_id UUID,
  session_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP
)

themes (
  id UUID PRIMARY KEY,
  tenant_id UUID,
  name VARCHAR(255),
  settings JSONB,              -- {"primary_color": "#FF5733", ...}
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

pages (
  id UUID PRIMARY KEY,
  tenant_id UUID,
  title VARCHAR(255),
  slug VARCHAR(255),
  content TEXT,
  is_published BOOLEAN,
  published_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Indexes for Performance

```sql
-- Critical for multi-tenant queries
CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_tenant_id ON user_roles(tenant_id);

-- For common queries
CREATE INDEX idx_orders_status ON orders(tenant_id, status);
CREATE INDEX idx_products_slug ON products(tenant_id, slug);
CREATE INDEX idx_customers_email ON customers(tenant_id, email);
CREATE INDEX idx_analytics_created_at ON analytics_events(tenant_id, created_at DESC);

-- For uniqueness
CREATE UNIQUE INDEX idx_tenants_subdomain ON tenants(subdomain);
CREATE UNIQUE INDEX idx_user_roles_unique ON user_roles(user_id, tenant_id);
```

---

## ROW LEVEL SECURITY (RLS) IMPLEMENTATION

### Overview

RLS ensures that users can only access data from their own tenant. This is enforced at the **database level**, making it impossible to leak data even if the application code has bugs.

### Core Concept

Every user has their `tenant_id` stored in their JWT `app_metadata`:

```javascript
// JWT payload
{
  sub: "user-uuid",
  email: "merchant@example.com",
  app_metadata: {
    tenant_id: "tenant-uuid",
    role: "owner"
  }
}
```

### Helper Functions

```sql
-- Get current user's tenant_id from JWT
CREATE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has specific role
CREATE FUNCTION user_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND tenant_id = get_user_tenant_id()
        AND role = required_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Example RLS Policies

```sql
-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Users can view products in their tenant
CREATE POLICY "Users can view products in their tenant"
ON products FOR SELECT
TO authenticated
USING (tenant_id = get_user_tenant_id());

-- Staff can manage products
CREATE POLICY "Staff can manage products"
ON products FOR INSERT, UPDATE, DELETE
TO authenticated
USING (tenant_id = get_user_tenant_id())
WITH CHECK (tenant_id = get_user_tenant_id());

-- Public can view published products
CREATE POLICY "Public can view published products"
ON products FOR SELECT
TO anon
USING (status = 'active' AND published_at IS NOT NULL);
```

### Role-Based Access Control

**Owner Role:**
- All permissions in tenant
- Can invite/remove users
- Can modify billing and plan
- Can delete store

**Admin Role:**
- Manage products, orders, customers
- Configure payment gateways
- View analytics
- Cannot manage billing

**Staff Role:**
- Create/edit products
- Manage orders and fulfillment
- View customers
- Cannot access settings

**Developer Role:**
- API access for integrations
- Cannot modify store settings
- Read-only analytics

---

## API ENDPOINTS

### Authentication Endpoints

```
POST /api/v1/auth/signup
- Create new user and tenant
- Request: { email, password, fullName, storeName, subdomain, businessType }
- Response: { user, tenant, accessToken }

POST /api/v1/auth/login
- Authenticate user
- Request: { email, password }
- Response: { accessToken, refreshToken, user }

POST /api/v1/auth/logout
- Logout user
- Headers: Authorization: Bearer {token}

POST /api/v1/auth/refresh-token
- Refresh JWT token
- Request: { refreshToken }
- Response: { accessToken, refreshToken }

GET /api/v1/auth/user
- Get current user profile
- Headers: Authorization: Bearer {token}
```

### Tenant Management

```
GET /api/v1/tenants/me
- Get current tenant details

PATCH /api/v1/tenants/me
- Update tenant settings
- Request: { name, settings: { currency, timezone, ... } }

GET /api/v1/tenants/me/users
- List all users in tenant

POST /api/v1/tenants/me/users
- Invite user to tenant
- Request: { email, role }
```

### Products

```
GET /api/v1/products
- Query: page, limit, status, search
- Response: { products: [...], total, page, limit }

GET /api/v1/products/{id}
- Get product detail

POST /api/v1/products
- Create product
- Request: { title, slug, description, variants, images, ... }

PATCH /api/v1/products/{id}
- Update product

DELETE /api/v1/products/{id}
- Delete product

POST /api/v1/products/{id}/variants
- Create variant

PATCH /api/v1/variants/{id}
- Update variant

POST /api/v1/products/bulk-upload
- Bulk upload products via CSV
```

### Categories

```
GET /api/v1/categories
GET /api/v1/categories/{id}
POST /api/v1/categories
PATCH /api/v1/categories/{id}
DELETE /api/v1/categories/{id}
```

### Customers

```
GET /api/v1/customers
- Query: page, limit, search

GET /api/v1/customers/{id}
POST /api/v1/customers
PATCH /api/v1/customers/{id}
GET /api/v1/customers/{id}/orders
```

### Orders

```
GET /api/v1/orders
- Query: page, limit, status, financial_status, start_date, end_date

GET /api/v1/orders/{id}
POST /api/v1/orders
PATCH /api/v1/orders/{id}
POST /api/v1/orders/{id}/cancel
POST /api/v1/orders/{id}/fulfillments
GET /api/v1/orders/{id}/fulfillments
```

### Payments

```
POST /api/v1/payments/process
- Request: { orderId, amount, gateway, paymentMethod }

GET /api/v1/orders/{id}/transactions
POST /api/v1/payments/{id}/refund
POST /api/v1/webhooks/payhere
POST /api/v1/webhooks/stripe
POST /api/v1/webhooks/paypal
```

### Discounts

```
GET /api/v1/discount-codes
POST /api/v1/discount-codes
PATCH /api/v1/discount-codes/{id}
DELETE /api/v1/discount-codes/{id}
POST /api/v1/discount-codes/validate
```

### Inventory

```
GET /api/v1/inventory/locations
GET /api/v1/inventory/levels
POST /api/v1/inventory/adjust
```

### Analytics

```
GET /api/v1/analytics/dashboard
GET /api/v1/analytics/sales
GET /api/v1/analytics/products
POST /api/v1/analytics/events
```

### Public Storefront APIs (No Auth Required)

```
GET /api/v1/storefront/{subdomain}/products
GET /api/v1/storefront/{subdomain}/products/{slug}
GET /api/v1/storefront/{subdomain}/categories
POST /api/v1/storefront/{subdomain}/cart
POST /api/v1/storefront/{subdomain}/checkout
```

---

## PAGE STRUCTURE & WORKFLOW

### Public Pages (Customer-Facing)

#### Landing Page
- **URL:** `/`
- **Purpose:** Marketing, drive signups
- **Components:**
  - Hero section with CTA
  - Features overview with icons
  - Pricing comparison table
  - Customer testimonials
  - FAQ section
  - Footer

#### Product Listing
- **URL:** `/{subdomain}/products`
- **Features:**
  - Product grid with images
  - Filter by category, price, rating
  - Sort by relevance, price, newest
  - Pagination
  - Add to cart

#### Product Detail
- **URL:** `/{subdomain}/products/{slug}`
- **Features:**
  - Image carousel
  - Price, description, ratings
  - Variant selector (color, size)
  - Quantity picker
  - Add to cart / Buy now
  - Customer reviews

#### Shopping Cart
- **URL:** `/{subdomain}/cart`
- **Features:**
  - List of items with quantities
  - Remove/update items
  - Subtotal calculation
  - Promo code input
  - Checkout button

#### Checkout
- **URL:** `/{subdomain}/checkout`
- **Steps:**
  1. Guest/Login option
  2. Shipping address
  3. Billing address
  4. Shipping method
  5. Payment method (PayHere, Stripe, PayPal)
  6. Order review
  7. Place order
- **Features:**
  - Auto-fill from customer profile
  - Address validation
  - Real-time tax calculation
  - Discount application
  - Payment processing

#### Order Confirmation
- **URL:** `/{subdomain}/order-confirmation/{orderId}`
- **Features:**
  - Order number
  - Items purchased
  - Total amount
  - Estimated delivery
  - Track order link
  - Invoice download

### Admin Dashboard Pages

#### Dashboard Home
- **URL:** `/admin/dashboard`
- **Widgets:**
  - Revenue card (today, week, month, year)
  - Orders chart (line/bar chart)
  - Top products table
  - Recent orders list
  - Quick actions (Add product, Create order)

#### Products List
- **URL:** `/admin/products`
- **Features:**
  - Data table with search/filter
  - Filter by status (draft, active, archived)
  - Add product button
  - Bulk actions (delete, archive)
  - Edit/Delete individual items

#### Add/Edit Product
- **URL:** `/admin/products/new` or `/admin/products/{id}/edit`
- **Sections:**
  1. Basic Info (title, description, type)
  2. Images (drag-drop upload, reorder)
  3. Variants (create variants with SKU, price, inventory)
  4. Pricing (price, compare-at price, cost)
  5. Inventory (quantity, tracking)
  6. Shipping (weight, requires shipping)
  7. Organization (categories, tags)
  8. SEO (title, description, slug)
  9. Settings (status, visibility)
- **Actions:** Save draft, Preview, Publish

#### Orders List
- **URL:** `/admin/orders`
- **Features:**
  - Data table with search
  - Filter by status, payment status, date range
  - Export to CSV
  - Click to view detail

#### Order Detail
- **URL:** `/admin/orders/{id}`
- **Sections:**
  1. Order header (order #, date, status badges)
  2. Customer info (name, email, phone)
  3. Items list (product, quantity, price)
  4. Fulfillment section (shipping address, carrier, tracking)
  5. Payment details (method, amount, status)
  6. Timeline (created, paid, shipped, delivered)
  7. Actions (add tracking, refund, cancel)

#### Customers List
- **URL:** `/admin/customers`
- **Features:**
  - Data table with search
  - Filter by tags, registration date
  - Add customer button
  - Click to view profile

#### Inventory Dashboard
- **URL:** `/admin/inventory`
- **Features:**
  - Stock levels by variant
  - Low stock alerts
  - Adjust inventory button
  - Filter by location
  - Import/export stock data

#### Analytics - Sales
- **URL:** `/admin/analytics/sales`
- **Charts:**
  - Revenue over time (line chart)
  - Orders count
  - Average order value
  - Conversion rate
- **Features:**
  - Date range selector
  - Export report
  - Comparison with previous period

#### Store Settings
- **URL:** `/admin/settings/store`
- **Fields:**
  - Store name
  - Logo upload
  - Contact email
  - Currency selection
  - Timezone
  - Tax rate

#### Payment Gateways
- **URL:** `/admin/settings/payments`
- **Gateways:**
  - PayHere (API key, merchant ID, test/live toggle)
  - Stripe (publishable key, secret key)
  - PayPal (client ID, secret)
- **Features:**
  - Test gateway connection
  - Enable/disable gateway
  - Webhook URL display (for setup)

#### Theme Customizer
- **URL:** `/admin/storefront/theme`
- **Options:**
  - Logo upload
  - Primary color picker
  - Secondary color picker
  - Font selection
  - Layout style (grid/list)
  - Live preview
  - Save and publish

#### Team Members
- **URL:** `/admin/team`
- **Features:**
  - List all team members with roles
  - Invite new user (email, role selection)
  - Remove member
  - Change member role
  - View member activity

#### Billing
- **URL:** `/admin/billing`
- **Info:**
  - Current plan display
  - Usage stats
  - Billing history (invoices)
  - Upgrade/downgrade buttons
  - Payment method on file

---

## REGISTRATION & ONBOARDING FLOW

### Step 1: Account Information

**Form Fields:**
- Full Name (required, 2-50 chars)
- Email (required, unique, valid format)
- Password (required, min 8 chars, complexity rules)
- Confirm Password (required, must match)

**Alternatives:**
- Sign up with Google
- Sign up with Facebook

**Validation:**
- Email uniqueness check
- Password strength indicator (real-time)
- Show/hide password toggle

### Step 2: Store Information

**Form Fields:**
- Store Name (required, 2-100 chars)
- Store Subdomain (required, 3-30 chars, alphanumeric + hyphens)
  - Real-time availability checker
  - Display as: `fashionboutique.yourplatform.com`
- Business Type (dropdown: Fashion, Electronics, Food, Health, Books, Other)
- Country (dropdown for currency/timezone)

### Step 3: Plan Selection

**Options:**
- 14-day Free Trial (default, no card required)
- Basic Plan (LKR 1,000/month)
- Professional Plan (LKR 2,500/month)

### Step 4: Terms & Agreement

**Checkbox:**
- "I agree to Terms of Service and Privacy Policy"
- Links open in new tab
- Must be checked to proceed

### Progress & UX

**Visual Elements:**
- Progress indicator: "Step 2 of 4"
- Progress bar
- Step navigation
- Can go back to previous steps

**CTA Button:**
- "Create My Store"
- Disabled until all validations pass
- Shows loading spinner during submission

### Backend Processing

**Database Operations (In Transaction):**
1. Create user in `auth.users`
   - Hash password
   - Set email
   - Add to `raw_user_meta_data`

2. Create tenant in `tenants`
   - Save store name, subdomain
   - Set plan type (trial)
   - Set trial end date
   - Store business_type in settings JSONB

3. Create relationship in `user_roles`
   - Link user to tenant
   - Set role as 'owner'

4. Update JWT claims
   - Add `tenant_id` to `app_metadata`
   - Add `role` to `app_metadata`

5. Create default resources
   - Default inventory location
   - Default theme
   - Send welcome email
   - Log analytics event

### Post-Registration

**Immediate Actions:**
1. Redirect to `/admin/dashboard`
2. Show welcome modal with onboarding checklist
3. Email verification banner (non-blocking)

**Onboarding Checklist:**
- ✅ Create your store (completed)
- ⬜ Add your first product
- ⬜ Customize your storefront
- ⬜ Set up payment gateway
- ⬜ Configure shipping
- ⬜ Launch your store

**Optional: Interactive Tour**
- Tooltips on key features
- Skip option
- Can resume anytime

---

## TEAM STRUCTURE

### MVP Team (8-10 people)

**Product & Design (2)**
- 1 Product Manager (full-time)
- 1 UI/UX Designer (full-time)

**Engineering (5)**
- 2 Frontend Developers (React/Next.js)
- 2 Backend Developers (Node.js/APIs)
- 1 DevOps Engineer (Infrastructure, Supabase setup)

**QA & Testing (1)**
- 1 QA Engineer (automation, manual testing)

**Optional for MVP:**
- 1 Data Analyst (analytics setup)
- 1 Community Manager (beta user support)

### Full Team (15-20 people after MVP)

**Product & Strategy (3)**
- Product Manager
- Product Designer
- UX Researcher

**Engineering (7)**
- 2 Frontend Developers
- 2 Backend Developers
- 1 Mobile Developer (iOS/Android)
- 1 DevOps/Infrastructure
- 1 Full-stack Developer

**Quality Assurance (2)**
- QA Engineer
- QA Automation Engineer

**Data & Analytics (2)**
- Data Analyst
- Analytics Engineer

**Customer Success (2)**
- Customer Success Manager
- Support Specialist

**Marketing (1)**
- Product Marketing Manager

### Hiring Timeline

**Month 1-2:** Hire core team (PM, designers, backend)
**Month 3:** Frontend developers
**Month 4:** DevOps, QA
**Month 6:** Customer success, analytics
**Month 9+:** Additional specialists

---

## FINANCIAL PLANNING

### Development Costs

**MVP Development (First 6 months):**

| Category | Cost (USD) | Cost (LKR) |
|----------|-----------|-----------|
| Discovery & Planning | $2-5K | 600K-1.5M |
| Design & UX | $3-10K | 900K-3M |
| Frontend Development | $8-25K | 2.4M-7.5M |
| Backend Development | $10-35K | 3M-10.5M |
| Database & Architecture | $3-8K | 900K-2.4M |
| Payment Integration | $2-5K | 600K-1.5M |
| Testing & QA | $3-10K | 900K-3M |
| Deployment & DevOps | $2-6K | 600K-1.8M |
| Marketing & Launch | $5-15K | 1.5M-4.5M |
| Legal & Compliance | $2-5K | 600K-1.5M |
| **Total MVP** | **$60-99K** | **18M-29.7M** |

**Exchange Rate Used:** 1 USD = 300 LKR

### Monthly Operating Costs

| Item | Monthly Cost (USD) |
|------|------------------|
| Cloud Infrastructure (AWS/Supabase) | $200-500 |
| Domain & SSL | $10-30 |
| Payment Gateway Fees | ~2-3% of revenue |
| Customer Support Tools | $100-300 |
| Monitoring & Analytics | $50-200 |
| **Team Salaries** (10 people) | $8,000-15,000 |
| **Total Monthly** | **$8,360-16,030** |

### Revenue Projections (Year 1)

**Conservative Scenario:**

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Active Stores | 50 | 150 | 500 |
| ARPU (LKR) | 1,500 | 1,800 | 2,000 |
| Subscription MRR | 75,000 | 270,000 | 1,000,000 |
| Transaction Volume | 500M | 1.5B | 5B |
| Transaction Fee Revenue | 7.5M | 22.5M | 75M |
| **Total Monthly Revenue** | 82.5M | 292.5M | 1,075M |

**Break-even:** Month 8-9 (depending on customer acquisition rate)

### Funding Strategy

**Seed Round: $100,000 USD**
- 60% Development & Hiring
- 25% Marketing & Customer Acquisition
- 15% Operations & Contingency

**Series A (Months 9-12): $500,000 USD**
- Scale development team
- Aggressive marketing
- Regional expansion
- Additional features

---

## RISK MANAGEMENT

### Technical Risks

**Risk:** Scalability bottlenecks
- **Impact:** High (users abandon platform)
- **Probability:** Medium
- **Mitigation:** Design for scale from day 1, load testing, use managed services (Supabase)

**Risk:** Payment gateway integration issues
- **Impact:** High (revenue blocked)
- **Probability:** Medium
- **Mitigation:** Multiple payment gateway options, thorough testing, dedicated integration team

**Risk:** Data security breach
- **Impact:** Critical (reputation, legal)
- **Probability:** Low
- **Mitigation:** Security best practices, regular audits, insurance, RLS policies

### Market Risks

**Risk:** Competitive pressure from Shopify
- **Impact:** High (lower adoption)
- **Probability:** High
- **Mitigation:** Focus on local market needs, better pricing, superior support

**Risk:** Payment gateway restrictions
- **Impact:** Medium (limits payment options)
- **Probability:** Medium
- **Mitigation:** Build multiple payment gateway integrations, partnerships with banks

**Risk:** Economic downturn
- **Impact:** Medium (lower spending on tools)
- **Probability:** Medium
- **Mitigation:** Free tier option, survival business model, B2B partnerships

### Operational Risks

**Risk:** Key person dependency
- **Impact:** Medium (project delays)
- **Probability:** Medium
- **Mitigation:** Cross-training, documentation, backup people for critical roles

**Risk:** Regulatory changes
- **Impact:** Medium (compliance costs)
- **Probability:** Low
- **Mitigation:** Legal consultation, flexible architecture, proactive monitoring

---

## SUCCESS METRICS & KPIs

### Business Metrics

**Growth Metrics:**
- Monthly Recurring Revenue (MRR): Target $50K by end of Year 1
- Customer Acquisition Cost (CAC): Target LKR 15,000
- Customer Lifetime Value (CLV): Target LKR 360,000
- Churn Rate: Target <5% monthly
- Payback Period: Target <2 months

**Engagement Metrics:**
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- User retention (30-day, 90-day)
- Feature adoption rate

### Product Metrics

**Performance:**
- Page load time: <2 seconds (target 50th percentile)
- API response time: <500ms (p95)
- Platform uptime: 99.9% SLA
- Error rate: <0.1%

**Usage:**
- Average products per store: 50+
- Average orders per store per month: 20+
- Average transaction value: LKR 3,000

### Customer Metrics

**Satisfaction:**
- Net Promoter Score (NPS): Target 50+
- Customer satisfaction (CSAT): Target 85%+
- Support ticket resolution time: <4 hours
- Support satisfaction: 90%+

**Retention:**
- 30-day retention: 70%+
- 90-day retention: 50%+
- 12-month retention: 35%+

### Development Metrics

**Quality:**
- Code coverage: >80%
- Bugs per release: <5
- Time to fix critical bugs: <2 hours
- Failed deployments: <1%

### Marketing Metrics

**Acquisition:**
- Cost per acquisition: LKR 15,000
- Conversion rate: 2-3%
- Sign-up to activated store: 60%+
- Referral rate: 15%+

---

## IMPLEMENTATION CHECKLIST

### Pre-Development
- [ ] Finalize product vision
- [ ] Secure initial funding
- [ ] Hire core team
- [ ] Establish development environment
- [ ] Create detailed technical specifications
- [ ] Set up project management tools (Jira, GitHub)

### Design Phase
- [ ] Complete user research
- [ ] Create wireframes for all pages
- [ ] Design high-fidelity mockups
- [ ] Build component library
- [ ] Get stakeholder approval

### Development Phase
- [ ] Set up Supabase project
- [ ] Create database schema
- [ ] Implement RLS policies
- [ ] Build authentication system
- [ ] Develop core features (products, orders, payments)
- [ ] Integrate payment gateways
- [ ] Build admin dashboard

### Testing Phase
- [ ] Set up test environment
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Perform load testing
- [ ] Security testing
- [ ] User acceptance testing with beta users

### Launch Phase
- [ ] Set up production environment
- [ ] Configure monitoring and alerts
- [ ] Train support team
- [ ] Prepare marketing materials
- [ ] Plan launch event
- [ ] Go live!

### Post-Launch
- [ ] Monitor KPIs daily
- [ ] Respond to user feedback
- [ ] Plan feature iterations
- [ ] Optimize based on usage data
- [ ] Plan next phase of development

---

## CONCLUSION

This comprehensive platform roadmap provides everything needed to build a **world-class Shopify alternative for Sri Lanka**. Success requires:

1. **Exceptional execution** on core features
2. **Deep understanding** of Sri Lankan merchant needs
3. **Unwavering focus** on user experience
4. **Continuous improvement** based on feedback
5. **Strong team** with diverse expertise
6. **Sufficient capital** to weather early months
7. **Strategic partnerships** with local payment providers

The combination of technical excellence, local market focus, and competitive pricing creates a strong opportunity to capture significant market share in the rapidly growing Sri Lankan e-commerce sector.

---

**Document Version:** 1.0  
**Last Updated:** October 30, 2025  
**Status:** Ready for Development  
**Next Review:** Monthly during development

---

## QUICK REFERENCE: KEY COMMANDS

### Starting Development

```bash
# Clone repository
git clone <your-repo-url>
cd shopify-saas

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start Supabase locally
supabase start

# Run development server
npm run dev

# Access dashboard
http://localhost:3000

# Run tests
npm run test

# Build for production
npm run build
```

### Database Setup

```bash
# Apply schema
supabase db reset

# View logs
supabase functions logs

# View database
supabase studio
```

### Deployment

```bash
# Deploy to Vercel (frontend)
vercel deploy

# Deploy to Railway/Heroku (backend)
git push heroku main

# Supabase migrations
supabase migration up
```

---

## APPENDIX: ADDITIONAL RESOURCES

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe API Documentation](https://stripe.com/docs)
- [PayHere Integration Guide](https://payhere.lk/developer)
- [GDPR Compliance](https://gdpr-info.eu)
- [PCI DSS Compliance](https://www.pcisecuritystandards.org)

---

## CHANGE LOG

### Version 1.0 (October 30, 2025)
- Initial comprehensive documentation
- Complete roadmap with timelines
- Database schema with 20+ tables
- 60+ API endpoints documented
- 40-page application structure
- Registration flow with backend details
- Financial projections and team structure


# 📱 Koopi E-Commerce Platform - Complete UI/UX Design Documentation

**Last Updated:** January 2025  
**Design System Version:** 1.0  
**Framework:** Next.js 15 + Tailwind CSS 4 + React 19

---

## 🎨 Design System & Visual Identity

### Color Palette

#### Primary Colors
- **Blue**: `#3B82F6` (blue-600) - Primary brand color
- **Purple**: `#9333EA` (purple-600) - Secondary brand color
- **Gradient**: Linear gradient from blue-600 to purple-600

#### Accent Colors
- **Success/Green**: `#10B981` (green-600)
- **Error/Red**: `#EF4444` (red-600)
- **Warning/Yellow**: `#F59E0B` (yellow-600)
- **Info/Orange**: `#F97316` (orange-600)

#### Neutral Colors
- **Gray Scale**: gray-50 through gray-900
- **White**: `#FFFFFF` - Primary background
- **Black**: `#000000` - Used in dark sections

### Typography System

#### Font Family
- **Primary**: System font stack (Arial, Helvetica, sans-serif)
- **Fallback**: Default sans-serif

#### Font Sizes & Usage
```
Hero Headings:     text-4xl sm:text-5xl lg:text-6xl (36px → 48px → 60px)
Section Titles:    text-4xl sm:text-5xl (36px → 48px)
Card Headers:      text-xl to text-2xl (20px → 24px)
Body Text:         text-base (16px)
Small Text:        text-sm (14px)
Tiny Text:         text-xs (12px)
```

#### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Subheadings
- **Bold**: 700 - Headings

### Spacing System

Following Tailwind's default spacing scale:
- `gap-1` to `gap-8` for grid/flex gaps
- `p-4`, `p-6`, `p-8` for padding
- `mb-4`, `mb-6`, `mb-8` for margins

### Border Radius

- **Small**: `rounded-lg` (8px) - Form inputs
- **Medium**: `rounded-xl` (12px) - Cards, buttons
- **Large**: `rounded-2xl` (16px) - Sections, modals
- **Full**: `rounded-full` - Avatars, badges

### Shadows

- **Small**: `shadow-sm` - Subtle elevation
- **Medium**: `shadow-lg` - Cards
- **Large**: `shadow-2xl` - Modals, popovers
- **Colored**: `shadow-blue-500/20` - CTA buttons

---

## 🏗️ Design Principles

### 1. Glassmorphism
Heavy use of frosted glass effect throughout the application:
- `backdrop-blur-2xl` for strong blur effect
- `backdrop-blur-xl` for medium blur
- Semi-transparent backgrounds (`bg-white/95`, `bg-white/70`)
- Creates depth and modern aesthetic

### 2. Gradient Aesthetics
- Blue-to-purple gradients as primary visual theme
- Used in: buttons, headers, accents, background orbs
- Subtle gradient overlays on cards and sections

### 3. Smooth Animations
- All interactive elements use `transition-all`
- Hover states with scale, shadow, and color changes
- Active states with slight scale down (`active:scale-95`)
- Custom fadeIn animation for content loading

### 4. Responsive First
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Adaptive layouts that transform between devices
- Touch-optimized for mobile (minimum 44px touch targets)

### 5. Visual Hierarchy
- Clear distinction between primary and secondary actions
- Strategic use of color, size, and contrast
- Whitespace for breathing room
- Consistent spacing patterns

---

## 🏠 Landing Page Design

### Header/Navigation

#### Desktop Header (Dock Style)
```
Position: Fixed, top-center, floating
Style: Glassmorphic rounded-2xl dock
Components:
  - Logo (Koopi brand)
  - Navigation links (Features, About)
  - Auth buttons (Login, Start Free)
  - Language switcher (Globe icon + dropdown)
  
Visual Effects:
  - Frosted glass background
  - Subtle shadow
  - Hover underline animations
  - Gradient CTA button
```

#### Mobile Header
```
Position: Fixed top, full-width
Style: White with blur, sticky
Components:
  - Logo
  - Hamburger menu icon
  - Slide-out navigation panel
  
Interactions:
  - Smooth slide animation
  - Backdrop overlay
  - Collapsible sections
```

### Hero Section

**Layout:**
- Full-width section with gradient background orbs
- Centered content with large typography
- Two-CTA button layout
- Browser mockup illustration

**Visual Elements:**
- Floating gradient orbs (blue and purple) with heavy blur
- Large bold headline with blue accent color on key phrase
- Spacious padding for impact
- macOS-style window controls on mockup

**Responsive Behavior:**
- Text scales down on mobile
- CTAs stack vertically on small screens
- Mockup image responsive sizing

### Features Section

**Grid Layout:**
- 6 cards in 3-column grid (desktop)
- 2 columns on tablet
- 1 column on mobile

**Card Design:**
```
Structure:
  - Icon container (blue background, rounded)
  - Title (font-semibold)
  - Description (gray text)
  
Styling:
  - White background
  - Gray border
  - Rounded-2xl corners
  - Shadow-lg
  
Hover Effect:
  - Lift animation (-translate-y-1)
  - Enhanced shadow (shadow-xl)
  - Smooth transition
```

**Icons Used:**
- Zap (Lightning Fast Setup)
- Smartphone (Mobile Optimized)
- ShieldCheck (Secure Payments)
- BarChart2 (Analytics Dashboard)
- Palette (Custom Themes)
- LifeBuoy (24/7 Support)

### Pricing Section

**Layout:**
- Two-column comparison
- Free vs Pro plans
- Equal height cards

**Card Components:**
```
Header:
  - Plan name
  - Badge (if applicable)
  - Description
  
Pricing:
  - Large price display
  - Period text (smaller)
  
Features:
  - Checkmark list
  - Green check icons
  - Clear feature descriptions
  
CTA:
  - Full-width button
  - Active for Free plan
  - Disabled for Pro plan
```

### CTA Section

**Design:**
- Dark background (gray-900)
- White text for contrast
- Gradient accent orbs
- Rounded card container
- Centered content
- Two-button layout (primary + secondary)

### Footer

**Simple Layout:**
- Single row flexbox
- Copyright on left
- Social icons + links on right
- Minimal, clean design

---

## 🔐 Authentication Pages

### Split-Screen Layout

#### Left Panel (Form Side)
```
Width: 50% (100% on mobile)
Background: White
Content: Authentication forms
```

#### Right Panel (Testimonial Side)
```
Width: 50% (hidden on mobile)
Background: Gradient from gray-900 to black
Content: Rotating testimonials
Features:
  - Auto-carousel (5-second intervals)
  - Dot indicators
  - Customer quotes
  - Fade transitions
```

### Login Page

**Form Elements:**
1. Email input
2. Password input with "Forgot password" link
3. Remember me checkbox
4. Submit button with loading state
5. Social login buttons (Google, Apple*, Microsoft*)
   *Placeholder for future implementation

**Validation & Feedback:**
- Error messages with AlertCircle icon
- Red background for error states
- Loading spinner during authentication
- Disabled state styling

### Signup Page

**Form Structure:**
1. Email input
2. Password input with real-time strength validation
3. Store name input
4. Store slug input (auto-generated + availability check)
5. Terms acceptance checkbox
6. Submit button (conditional enabling)
7. Social signup options

**Password Strength Validator:**
```
Three requirements:
  ✓ Cannot contain name/email
  ✓ At least 8 characters
  ✓ Contains number or symbol
  
Visual Feedback:
  - Checkbox indicators (green when met)
  - Real-time validation
  - Clear requirement text
```

**Slug Availability Checker:**
```
States:
  - Idle: Gray text
  - Checking: Blue spinner + "Checking..."
  - Available: Green check + domain preview
  - Unavailable: Red X + suggestion
  
Features:
  - Debounced API calls (500ms)
  - Auto-sanitization
  - Alternative suggestions
```

**Progressive Disclosure:**
- Button disabled until all requirements met
- Helper text shows missing requirements
- Visual feedback for each validation state

---

## 📊 Dashboard Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│            Dashboard Header             │ ← Top sticky
├────────┬────────────────────────────────┤
│        │                                │
│ Side   │                                │
│ bar    │        Main Content            │
│        │        (Scrollable)            │
│        │                                │
└────────┴────────────────────────────────┘
```

### Sidebar

**Design:**
```
Width: 288px (w-72)
Position: Fixed left (mobile: slide-out)
Background: Glassmorphic white
Style: Frosted glass with border
```

**Components:**

1. **Header Section**
   - Koopi logo with favicon
   - Close button (mobile only)

2. **Store Info Card**
   - Gradient background (blue-to-purple tint)
   - Store name (bold)
   - Plan status with badge
   - Trial days remaining (if applicable)
   - Colored badges: Yellow (trial), Green (free), Purple (pro)

3. **Navigation Menu**
   - 7 menu items with icons
   - Active state: gradient background + border
   - Hover state: white background + shadow
   - Icons from Lucide

4. **Footer**
   - Copyright text
   - Small gray text

**Navigation Items:**
- Overview (LayoutDashboard)
- Products (Package)
- Orders (ShoppingCart)
- Customers (Users)
- Analytics (BarChart3)
- Settings (Settings)
- Profile (User)

### Dashboard Header

**Layout:**
```
[Mobile Menu] [Page Title] ··· [Language] [Notifications] [User Menu]
```

**Components:**

1. **Mobile Menu Toggle** (mobile only)
   - Hamburger icon
   - Opens sidebar

2. **Page Title**
   - "Dashboard" or current page name
   - Hidden on small screens

3. **Language Switcher**
   - Globe icon + current locale
   - Dropdown with EN/සිංහල options
   - Active state highlighting

4. **Notifications**
   - Bell icon
   - Red dot indicator
   - (Future: dropdown menu)

5. **User Menu**
   - Avatar or initials in gradient circle
   - User name + email (desktop)
   - Dropdown with options:
     * Profile
     * Settings
     * Logout (red text)

### Dashboard Widgets

#### Stats Cards (4-card grid)

**Design:**
```
Card Structure:
  [Icon Circle]  [Title]
                 [Value]
                 [Trend]
                 
Colors:
  - Blue (Orders)
  - Purple (Products)
  - Green (Revenue)
  - Orange (Customers)
  
Hover: Enhanced shadow
```

#### Trial Banner

**Conditional Display:**
- Only shows for trial plans with days > 0

**Color Logic:**
```
Red:    ≤ 3 days remaining (urgent)
Yellow: 4-7 days remaining (warning)
Blue:   > 7 days remaining (info)
```

**Components:**
- Clock icon
- Days remaining text
- "Upgrade Now" button
- Dismiss button (X)

#### Quick Actions Cards

**Grid:** 3 columns
**Design:**
- Gradient tinted backgrounds (blue, purple, green)
- Icon in colored circle
- Title + description
- Hover: scale animation + shadow

**Actions:**
1. Add Product (Plus icon, blue)
2. Customize Store (Palette icon, purple)
3. Settings (Settings icon, green)

#### Empty States

**Reusable Component:**
```jsx
<EmptyState
  icon={Icon}
  title="Title"
  description="Description"
  action={{ label: "CTA", onClick: fn }}
/>
```

**Visual Design:**
- Gray circular icon container
- Title (semibold, gray-900)
- Description (gray-600)
- Optional CTA button (blue)

### Onboarding Modal

**4-Step Wizard:**

**Step 1: Profile Information**
- Display name input
- Phone number input
- Profile photo upload
- Icon: User

**Step 2: Store Details**
- Store description textarea
- Categories input (comma-separated)
- Store logo upload
- Icon: Store

**Step 3: Business Settings**
- Shipping locations input
- Return policy textarea
- Business hours input
- Icon: Settings

**Step 4: Completion**
- Success icon (green circle with check)
- Congratulations message
- Feature checklist
- Icon: Check/Sparkles

**Modal Design Features:**
- Frosted glass background overlay
- Large rounded modal (rounded-3xl)
- Gradient header section
- Progress bar with step indicators
- Smooth step transitions (fadeIn)
- Skip/Back/Next navigation
- Loading state on submission

**Progress Indicator:**
```
(1)━━━(2)━━━(3)━━━(4)

States:
  Completed: Green gradient circle with check
  Current:   Blue gradient circle, scaled up
  Upcoming:  Gray circle with number
```

---

## 🎭 UI Patterns & Components

### Buttons

#### Primary Button
```css
bg-gradient-to-r from-blue-600 to-purple-600
text-white
shadow-lg shadow-blue-500/30
hover:from-blue-700 hover:to-purple-700
```

#### Secondary Button
```css
bg-white
border border-gray-300
text-gray-700
hover:bg-gray-50
```

#### Destructive Button
```css
bg-red-600
text-white
hover:bg-red-700
```

#### Loading State
```jsx
<button disabled>
  <Loader2 className="animate-spin" />
  Loading...
</button>
```

### Form Inputs

**Standard Input:**
```css
w-full px-4 py-2.5
bg-white
border border-gray-300 rounded-lg
focus:outline-none 
focus:ring-2 focus:ring-blue-500
focus:border-transparent
transition-all
```

**Textarea:**
- Same styling as input
- `resize-none` to prevent manual resizing
- Defined `rows` attribute

**File Upload:**
- Custom styled file input
- Gradient upload button
- Preview functionality

### Dropdowns

**Design:**
```css
bg-white/95 backdrop-blur-xl
rounded-xl
shadow-2xl
border border-gray-200/50
ring-1 ring-black/5
```

**Behavior:**
- Click to open
- Click outside to close
- Hover states on items
- Active item highlighted (blue tint)

### Icons

**Library:** Lucide React
**Size:** Typically `h-5 w-5` or `h-6 w-6`
**Usage:** 
- Navigation icons
- Status indicators
- Action buttons
- Decorative elements

### Badges

**Plan Badges:**
```jsx
// Trial
<Badge className="bg-yellow-100 text-yellow-800">Trial</Badge>

// Free
<Badge className="bg-green-100 text-green-800">Free</Badge>

// Pro
<Badge className="bg-purple-100 text-purple-800">Pro</Badge>
```

### Avatars

**User Avatar:**
- Round shape (rounded-full)
- Image if available, initials fallback
- Gradient background for initials
- 32px × 32px size (h-8 w-8)

### Loading States

**Spinner:**
```jsx
<Loader2 className="h-5 w-5 animate-spin" />
```

**Skeleton Screens:**
- Not currently implemented
- Future enhancement

---

## 🎬 Animations & Transitions

### Custom Animations

**FadeIn:**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
```

### Transition Patterns

**Hover Effects:**
- Scale: `hover:scale-105` or `hover:-translate-y-1`
- Shadow: `hover:shadow-xl`
- Color: `hover:bg-blue-700`
- Combined with `transition-all duration-300`

**Active Effects:**
- Scale down: `active:scale-95`
- Instant feedback for clicks

**Focus Effects:**
- Ring: `focus:ring-2 focus:ring-blue-500`
- Border: `focus:border-transparent`

### Loading Animations

**Spin:**
```jsx
<Icon className="animate-spin" />
```

**Pulse:**
```jsx
<div className="animate-pulse bg-gray-200" />
```

---

## 📱 Responsive Design Strategy

### Breakpoints

```
sm:  640px  (Mobile landscape, small tablets)
md:  768px  (Tablets)
lg:  1024px (Small laptops)
xl:  1280px (Desktop)
2xl: 1536px (Large desktop)
```

### Mobile Optimizations

**Navigation:**
- Hamburger menu
- Slide-out sidebar
- Full-screen overlays

**Typography:**
- Reduced font sizes
- Adjusted line heights
- Shorter paragraphs

**Layout:**
- Single column grids
- Stacked elements
- Full-width components

**Touch Targets:**
- Minimum 44px × 44px
- Adequate spacing between elements
- Larger padding on buttons

### Tablet Adjustments

- 2-column grids
- Reduced sidebar width
- Hybrid navigation patterns

### Desktop Enhancements

- Multi-column layouts
- Fixed sidebar (always visible)
- Hover effects enabled
- Larger typography scale

---

## 🌐 Internationalization Design

### Language Support
- English (en)
- Sinhala (si)

### Implementation
- next-intl library
- JSON translation files
- Locale-based routing

### UI Considerations
- RTL support (if needed for future languages)
- Text expansion allowance
- Cultural color considerations

### Language Switcher Design
- Globe icon indicator
- Dropdown menu
- Active language highlighted
- Available on all pages

---

## 🎨 Component Library

### Reusable Components

1. **StatsCard**
   - Props: title, value, icon, trend, color
   - Responsive grid layout

2. **EmptyState**
   - Props: icon, title, description, action
   - Centered layout with CTA

3. **TrialBanner**
   - Props: daysLeft, onDismiss
   - Conditional rendering based on plan

4. **OnboardingModal**
   - Multi-step wizard
   - Form state management
   - File upload handling

5. **DashboardLayout**
   - Sidebar + Header + Content
   - Context providers
   - Responsive behavior

6. **AuthLayout**
   - Split-screen design
   - Testimonial carousel
   - Mobile adaptation

---

## 🎯 Design Best Practices

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratios (WCAG AA)
- Focus indicators visible

### Performance
- Optimized images
- Lazy loading (Next.js built-in)
- Minimal animation overhead
- Efficient re-renders

### Consistency
- Unified color palette
- Consistent spacing
- Predictable patterns
- Reusable components

### User Experience
- Clear visual hierarchy
- Immediate feedback on actions
- Error prevention through validation
- Helpful error messages
- Loading states for async actions

---

## 🔮 Future Design Enhancements

### Planned Improvements
1. Dark mode support
2. More animation micro-interactions
3. Skeleton loading screens
4. Advanced data visualizations
5. Drag-and-drop interfaces
6. Custom theme builder
7. Additional social login providers
8. Mobile app design system

### Design System Evolution
- Component documentation site
- Design tokens
- Figma integration
- Accessibility audit
- Performance monitoring

---

**End of Design Documentation**

*This design system provides a comprehensive foundation for building a modern, accessible, and delightful user experience in the Koopi e-commerce platform.*

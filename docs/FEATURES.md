## Dyno Labels – Feature Overview

A mobile‑first web app for jewellery shops to generate live price labels with QR codes and barcodes.

### Core
- Live price labels: Each product has a public page with a QR code link and barcode for quick scanning.
- Auto price calculation: Final price = materials cost + making charges + tax (calculated in real time).
- Mobile‑first UI: Optimized for phone use; bottom navigation on mobile, simple clean screens.

### Authentication & Access
- Email/password login and sign up.
- Smart redirects: Logged‑in users go straight to Dashboard (not to Home/Login/Sign up).

### Branding
- Theme selector (4 palettes: Emerald, Royal, Amber, Rose).
- Theme persists per shop and reflects on public product pages.
- Minimal, brand‑friendly public page (no app header).

### Materials (Price Chart)
- Add, edit, delete materials (e.g., Gold 22K, Diamond Type 1).
- Set unit and price per unit.
- Materials list sorted and searchable via the browser (native find).

### Products
- Create products with selected materials and quantities.
- Auto compute total with making charges and tax.
- Auto‑generate QR code (link to public page) and Code128 barcode (for POS/stock).
- View product QR + barcode; open public page; delete product.

### Public Product Page (for customers)
- Shows product name, shop name, product ID, price breakdown (subtotal, tax, final).
- Displays QR and barcode; styled with the shop’s theme.
- Lightweight view suitable for instant price checks via QR scan.

### Label Printing
- Dedicated Labels screen to print QR/barcode labels.
- Options: QR only, Barcode only, or Both.
- Grid layout controls: columns, label size (mm), and gaps (mm).
- Product ID auto‑printed under the code; print‑only view (no extra UI).

### Quality & UX Details
- Clean, consistent UI components (buttons, inputs, cards).
- Minimal home page with product name (Dyno Labels) and CTAs (Login, Sign up).
- Sticky theme switcher in header (desktop) with instant preview.
- Error messages for common actions (e.g., duplicate email on sign up).

### Security & Safety
- Passwords stored hashed (bcrypt).
- Session based on secure tokens; only owners can manage their materials/products.

### What this enables for your business
- Keep one source of truth for material prices; product prices stay in sync automatically.
- Print shelf/display labels quickly in the format you need.
- Let customers scan a QR to view the latest price on a branded page.
- Simple daily workflow on mobile for staff.

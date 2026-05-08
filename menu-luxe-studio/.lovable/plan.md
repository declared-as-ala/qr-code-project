## Premium QR Menu SaaS — Frontend Prototype

A complete, mock-data frontend for a digital QR menu platform with three experiences: Super Admin, Restaurant Admin, and Public Mobile Menu. French UX copy, black/gold/cream premium aesthetic, no backend.

### Design System

- **Palette** (oklch tokens in `src/styles.css`): deep noir background, warm cream surface, gold accent (`#C9A24B`-ish), warm brown muted, soft ivory text. Light + dark variants.
- **Typography**: Display serif (Playfair Display) for headings, Inter for UI body — loaded via Google Fonts in `__root.tsx`.
- **Tokens**: gradients (`--gradient-gold`, `--gradient-noir`), elegant shadows (`--shadow-elegant`, `--shadow-gold-glow`), smooth transitions.
- **Components**: shadcn/ui base + custom premium variants (button `gold`, `outline-gold`; card `elevated`, `glass`).
- **Polish**: framer-motion entrance animations on hero/menu, skeleton loaders, sonner toasts, confirm dialogs.

### Mock State

- `src/lib/mock-data.ts` — enseignes, categories, products, scans, owners.
- `src/lib/auth-store.ts` — Zustand (or React context) holding `{ role, user }` with a dev role-switcher in topbar to flip between super_admin / restaurant_admin / logged-out for preview.
- All mutations update in-memory state; no persistence.

### Route Map (TanStack Start, file-based)

```
src/routes/
  __root.tsx                       Shell + fonts + Toaster + role context
  index.tsx                        Redirect → /login
  login.tsx                        Premium login (no register)
  forgot-password.tsx
  reset-password.tsx

  _admin.tsx                       Super-admin layout (sidebar + topbar)
  _admin/admin.tsx                 Dashboard (KPIs, charts, recent enseignes)
  _admin/admin.enseignes.tsx       List + filters + QR action
  _admin/admin.enseignes.new.tsx   Multi-tab create form
  _admin/admin.enseignes.$id.tsx   Edit form (same shape)

  _resto.tsx                       Restaurant-admin layout
  _resto/dashboard.tsx             Welcome KPIs + quick actions
  _resto/dashboard.menu.tsx        Categories ⇄ products manager
  _resto/dashboard.qr-code.tsx     QR preview + plaque mockup
  _resto/dashboard.settings.tsx    Info / branding / socials / password

  menu.$slug.tsx                   Public mobile menu (stunning)
```

### Reusable Components (`src/components/`)

- `layout/AdminSidebar.tsx`, `RestoSidebar.tsx`, `Topbar.tsx`, `RoleSwitcher.tsx`
- `kpi/StatCard.tsx`, `kpi/MiniChart.tsx` (recharts placeholder)
- `enseigne/EnseigneTable.tsx`, `EnseigneForm.tsx` (tabs: Infos / Branding / Compte / Réseaux)
- `menu/CategoryList.tsx`, `ProductCard.tsx`, `ProductDialog.tsx`, `BadgePill.tsx`
- `qr/QrPreview.tsx` (uses `qrcode.react`), `PlaqueMockup.tsx`
- `public-menu/Hero.tsx`, `StickyCategoryNav.tsx`, `PublicProductCard.tsx`, `WhatsAppButton.tsx`
- `common/EmptyState.tsx`, `ConfirmDialog.tsx`, `ImageUpload.tsx` (mock), `ColorPicker.tsx`

### Page Highlights

- **Login**: split-screen — left café photo with gold overlay + brand name, right elegant form.
- **Super Admin Dashboard**: 4 KPI cards with gold accents, line chart (scans), bar chart (signups), recent enseignes list with avatars.
- **Enseignes list**: search + type/status filters, table with logo, status pill, copy-link, QR-modal, edit, toggle.
- **Enseigne form**: tabbed card layout, image dropzones, color swatches, password generator button.
- **Resto Dashboard**: hero greeting "Bonjour, {nom}", status badge "Menu publié", quick-action grid.
- **Menu manager**: 2-column — sortable categories left, product grid right, drawer-based product editor.
- **QR Code page**: large gold-framed QR, copy/download buttons, 3D-ish plaque mockup with QR rendered on it.
- **Public `/menu/:slug`**: full-bleed cover hero, sticky translucent category bar, animated product cards, floating WhatsApp + Location FABs, mobile-first with desktop centered max-w-md frame.
- **Settings**: sectioned cards, change-password with strength meter.

### Tech

- Existing TanStack Start + Tailwind v4 + shadcn stack.
- Add: `framer-motion`, `qrcode.react`, `recharts`, `zustand`, `react-hook-form` + `zod`.
- All copy in French. All colors via semantic tokens.

### Out of Scope (this turn)

- Real auth, database, API calls, file uploads, image hosting, email — all mocked.

After approval I'll build it in batches: tokens & layouts → super-admin pages → resto pages → public menu → polish.

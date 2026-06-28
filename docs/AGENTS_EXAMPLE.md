# Project: foro-unsaac-mobile

A React Native/Expo forum application for UNSAAC (Universidad Nacional de San Antonio Abad del Cusco). Production-ready mobile app with auth, threads, comments, reactions, in-app games, notifications, category subscriptions, deep links, media uploads, and admin moderation.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Expo SDK 54 + Expo Router (file-based routing) |
| Language | TypeScript 5.9 |
| Runtime | React 19.1.0, React Native 0.81.5 |
| Server State | TanStack React Query v5 |
| Client State | Zustand |
| Navigation | React Navigation v7 (stack) + custom PagerView tabs |
| Icons | lucide-react-native |
| Forms | react-hook-form + zod (`@hookform/resolvers/zod`) |
| Media | expo-camera, expo-image-picker, expo-media-library, expo-image |
| Native | Expo ecosystem (blur, image, secure-store, haptics) |
| Architecture | New Architecture enabled (bridgeless) |

**References:**
- Expo SDK docs: https://docs.expo.dev/versions/v54.0.0/
- Expo Router: file-based routing in `app/` directory
- `@/` alias maps to project root (configured in `tsconfig.json`)

---

## Project Structure

Tree is a curated subset; not all source files are shown.

```
foro-unsaac-mobile/
├── app/                        # Expo Router file-based routing
│   ├── +native-intent.tsx      # Android redirectSystemPath: /t/:slug → /modal?slug=…
│   ├── _layout.tsx             # Root layout: providers, stack navigator, AppServices
│   ├── (auth)/                 # Auth group (unauthenticated users)
│   │   ├── _layout.tsx         # Auth guard: redirect if logged in
│   │   ├── login.tsx           # Email/password login (react-hook-form + zod)
│   │   ├── register.tsx        # Registration with OTP verification
│   │   └── verify-otp.tsx      # OTP code verification
│   ├── (tabs)/                 # Tab group — custom PagerView, 4 pages + center FAB
│   │   ├── _layout.tsx         # PagerView + BlurView tab bar + SubscriptionModal
│   │   ├── index.tsx           # Home — thread list (with FilterSheet, NotificationBell)
│   │   ├── popular.tsx         # Popular — hot threads leaderboard
│   │   ├── games.tsx           # Games — in-app mini-games grid
│   │   └── explore.tsx         # Account (legacy filename — see Known Inconsistencies)
│   ├── modal.tsx               # Thread detail modal
│   ├── modal-redirect.tsx      # UUID → slug resolver for notification deep links
│   ├── modal-notifications.tsx # Full-screen notification center
│   └── new-thread.tsx          # New thread creation modal
├── components/                 # React components (atomic design)
│   ├── comments/               # CommentSection, CommentRow, CommentCompose
│   ├── games/                  # 12 shared + 3 game organisms (Truth/Dare, Roulette, NHIE)
│   ├── molecule/               # action-menu, copyable-text, whatsapp-camera, theme-toggle-button
│   ├── notifications/          # notification-bell, notification-row
│   ├── reactions/              # ReactionBar (gesture-based emoji picker)
│   ├── subscriptions/          # subscription-modal, category-card (6 visual variants)
│   ├── threads/                # ThreadCard, ThreadDetail, NewThreadPanel, PopularThreadCard…
│   ├── ui/                     # AppModal, FormField, IconSymbol (iOS + Android variants)
│   ├── themed-text.tsx         # Dynamic text color from theme
│   ├── themed-view.tsx         # Dynamic background (background/card variants)
│   └── haptic-tab.tsx          # Orphan — file exists but no longer used by tab layout
├── hooks/                      # Custom React hooks
│   ├── use-auth.ts             # Auth mutations: login, register, verify-otp
│   ├── use-categories.ts       # GET /categories (5 min staleTime)
│   ├── use-color-scheme.ts     # RN passthrough
│   ├── use-comments.ts         # Comments list, create, delete (+ admin variants)
│   ├── use-deep-link.ts        # Consolidated: runtime + auth gate + replay
│   ├── use-game-cards.ts       # Static Truth/Dare + NeverHaveIEver card decks
│   ├── use-media-permissions.ts# Camera + library permission gating
│   ├── use-media-picker.ts     # Camera or gallery picker (up to 4 images)
│   ├── use-media-upload.ts     # 2-step upload: presign + PUT
│   ├── use-new-thread.ts       # Create-thread state machine
│   ├── use-notification-center.ts # Inbox: paginated, mark-read, mark-all-read
│   ├── use-notifications.ts    # OS-level listeners, token registration
│   ├── use-reactions.ts        # Reaction types, add/remove with optimistic UI
│   ├── use-subscriptions.ts    # Category subscriptions (Set<id>) + mutations
│   ├── use-threads.ts          # Paginated list, by-slug, by-id, admin delete, create
│   ├── use-theme-color.ts      # Theme-aware color access
│   └── use-users.ts            # PATCH /users/:id/name with cache patching
├── constants/
│   ├── theme.ts                # Theme colors and configuration
│   ├── Colors.ts               # Color palette definitions
│   ├── fonts.ts                # Font family/size scale
│   └── version.ts              # App version string
├── providers/
│   ├── app-providers.tsx       # QueryClient, ThemeProvider, DialogProvider
│   ├── dialog-provider.tsx     # AppModal context (openDialog/closeDialog)
│   └── tab-bar-context.tsx     # useTabBar() — height, isPagerLocked, lock/unlock
├── store/                      # Zustand state stores
│   ├── auth-store.ts           # User auth, token, login/logout (also clears push tokens)
│   ├── deep-link-store.ts      # pendingDeepLink (replayed after auth)
│   ├── onboarding-store.ts     # subscriptionModalDismissed flag
│   ├── theme-store.ts          # Theme preference (light/dark/system)
│   ├── reaction-store.ts       # Local reaction cache (optimistic UI)
│   ├── reaction-picker-store.ts# Reaction picker UI state
│   └── push-token-store.ts     # Push token state (register/clear/refresh)
├── services/                   # Pure (testable) helpers, no React
│   ├── navigation-service.ts   # URL → route resolver, isProtectedRoute, buildDeepLink
│   ├── notification-service.ts # Parse + dispatch notification data
│   └── push-notification-service.ts # Token registration (create channel, get token)
├── api/
│   └── index.ts                # Fetch-based API client with token refresh + 401 retry
├── lib/
│   ├── auth.ts                 # SecureStore token management
│   ├── category-style.ts       # Slug → icon/variant/color (deterministic hash)
│   ├── game-intensity.ts       # Shared intensity constants for games
│   ├── games-data.ts           # Static game metadata + starter cards
│   ├── media.ts                # getMediaType, normalizeMediaUrls
│   ├── project-id.ts           # Expo project ID (with fallback)
│   ├── query-client.ts         # Singleton QueryClient config
│   ├── utils.ts                # truncate, getAvatarInitial, formatRelativeTime
│   ├── validation.ts           # isUuid, assertUuid
│   └── schemas/                # Zod schemas
│       ├── auth.ts             # loginSchema, registerSchema, verifyOtpSchema
│       ├── threads.ts          # newThreadSchema
│       └── user.ts             # updateNameSchema
├── types/                      # TypeScript type definitions (Thread, NotificationItem, …)
├── assets/                     # Static assets (fonts, images)
├── docs/                       # Planning documentation
│   ├── MOBILE_DOC_PLAN_REACT_NATIVE.md
│   └── 02-NEW_ENDPOINTS.md
└── package.json
```

---

## Architecture

### Navigation Structure

**Root Stack** (`app/_layout.tsx`) — all screens `headerShown: false`:
```
Stack Navigator
├── (tabs)              → PagerView with 4 swipeable pages + center FAB
├── (auth)              → Auth screens (login, register, verify-otp)
├── new-thread          → Modal presentation (title: "Nuevo hilo")
├── modal               → Thread detail modal
├── modal-redirect      → Modal: UUID → slug resolver (notification deep links)
└── modal-notifications → Modal: full-screen notification center (title: "Notificaciones")
```

**App Services** (NEW) — `AppServices` in `app/_layout.tsx` (lines 15–19) is a no-render component that calls `useDeepLink()` and `useNotifications()` once at the root so their side effects run for the lifetime of the app. Do not call these hooks in individual screens.

**Auth Guard** (`app/(auth)/_layout.tsx`): Redirects authenticated users away from auth screens. While `isLoading` or `isAuthenticated`, renders `null` to avoid flicker.

**Tab Layout** (`app/(tabs)/_layout.tsx`) — **custom PagerView, not a standard Tabs navigator**:
- 4 swipeable pages (`react-native-pager-view`): Home (0), Popular (1), Games (2), Account (3) — `SwipeIndex = 0 | 1 | 2 | 3`
- 5-slot tab bar with a center `+` FAB (the FAB is an action button, **not** a page)
- `<TabBarProvider>` wraps the tree; child screens call `useTabBar()` for `tabBarHeight`, `isPagerLocked`, `lockPager`/`unlockPager` (used by `ThreadMediaGallery` to disable tab swipe while a carousel is being dragged)
- Custom `BlurView` (intensity 110) translucent tab bar; inline `Pressable` per tab (the old `HapticTab` is no longer used)
- Haptics: `Light` on tab tap and real swipe; `Medium` on FAB press; `isProgrammaticChange` ref prevents double haptic when a tap calls `pagerRef.setPage()` programmatically
- `<SubscriptionModal>` overlays the layout when the trigger conditions are met (see Subscriptions)
- Icons: `Home`, `Flame` (Popular), `Gamepad2` (Games), `User` (Account), `Plus` (center FAB) — all from `lucide-react-native`

### State Management

**Zustand** (lightweight client state):

| Store | Purpose |
|-------|---------|
| `auth-store.ts` | User auth, token management, login/logout. `logout()` also calls `useReactionStore.getState().clearReactions()` and `usePushTokenStore.getState().clearPushToken()`. |
| `theme-store.ts` | Theme preference (`'light' \| 'dark' \| 'system'`); `toggleTheme()` is binary dark↔light. |
| `reaction-store.ts` | Local reaction cache keyed `${type}:${id}` for optimistic UI. |
| `reaction-picker-store.ts` | Reaction picker open/closed state. |
| `push-token-store.ts` | Push token state. `setPushToken`, `clearPushToken` (server-side DELETE), `refreshPushToken` (POST /push-token/refresh). |
| `deep-link-store.ts` | `pendingDeepLink` (pathname + params) replayed after auth. |
| `onboarding-store.ts` | `subscriptionModalDismissed` flag + `dismissSubscriptionModal` / `resetSubscriptionModal` actions. |

**TanStack React Query** (server state) — common hooks:

| Hook | Purpose |
|------|---------|
| `useThreads(filters)` | Paginated thread list with `sortBy: 'latest' \| 'hot'` and `category` filters. |
| `useThreadBySlug(slug)` | Single thread detail. |
| `useThreadById(id)` | UUID → slug resolver (used by `modal-redirect`). |
| `useCreateThread()` | Create thread; anonymous variant posts to `/threads/anonymous`. |
| `useDeleteThreadAsAdmin()` | Admin moderation delete. |
| `useComments(threadId)` | Paginated comment list (page size 5). |
| `useCreateComment()` / `useDeleteComment()` | Comment mutations. |
| `useDeleteCommentAsAdmin()` | Admin moderation delete. |
| `useReactionTypes()` / `useReactions(targetType, targetId)` | Reaction catalog + per-target list. |
| `useAddReaction()` / `useRemoveReaction()` | Reaction mutations (optimistic). |
| `useCategories()` | Forum categories. |
| `useSubscriptions(enabled)` | Returns `Set<categoryId>` of subscribed categories. |
| `useSubscribe()` / `useUnsubscribe()` | Subscription mutations. |
| `useNotificationCenter(page)` | Paginated notification inbox. |
| `useUnreadNotificationCount()` | Derived count for bell badge. |
| `useMarkNotificationAsRead()` / `useMarkAllNotificationsAsRead()` | Read-state mutations. |
| `useUpdateUserName()` | `PATCH /users/:id/name`; patches both React Query cache and `useAuthStore`. |
| `useMediaUpload()` | 2-step upload: presign + PUT. |
| `useTruthOrDareCards()` / `useNeverHaveIECards()` | Static card decks shaped like a query result. |
| `useLogin()` / `useRegister()` / `useVerifyOtp()` | Auth mutations. |

### Theme System

**Location**: `constants/theme.ts` and `constants/Colors.ts`

Uses `@react-navigation/native`'s `ThemeProvider` with custom `DarkTheme` and `DefaultTheme` derived from the theme store.

```typescript
// light theme
{ text: '#11181C', background: '#fff', tint: '#0a7ea4', icon: '#687076' }
// dark theme
{ text: '#ECEDEE', background: '#151718', tint: '#fff', icon: '#9BA1A6' }
```

**Themed Components**:
- `ThemedText` — Dynamic text color from theme; semantic `type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link'`.
- `ThemedView` — Dynamic background (supports `'background' | 'card'` variant).

**Theme Store**: Zustand store with `theme: 'light' | 'dark' | 'system'`.

---

## Features

### Authentication (`app/(auth)/`)
- **Login**: Email/password (zod `loginSchema` requires `@unsaac.edu.pe`) → API → `useAuthStore.login(token, user)` → `router.replace('/')`.
- **Register**: Name/email/password (zod `registerSchema`) → API → `router.replace({ pathname: '/verify-otp', params: { email } })`.
- **Verify OTP**: Email + 6-digit code (zod `verifyOtpSchema`) → API → `useAuthStore.login(token, user)` → `router.replace('/')`.
- **Initialize**: On app load, check stored token → Validate with `GET /auth/me` → Set user or clear token.
- **Logout**: `POST /auth/logout` → clears `auth-store` + `reaction-store` + `push-token-store` → `router.replace('/login')`.
- **Forms**: All auth screens use `react-hook-form` + `@hookform/resolvers/zod` with `<FormField>` (`components/ui/form-field.tsx`).

### Subscriptions (NEW)
- **What it is:** Per-user category subscriptions with an onboarding modal that surfaces when a signed-in user has zero subscriptions and hasn't dismissed it.
- **Key files:** `store/onboarding-store.ts`, `components/subscriptions/{category-card, subscription-modal}.tsx`, `hooks/use-subscriptions.ts`, `lib/category-style.ts` (slug → icon/variant/color with deterministic 32-bit hash).
- **Trigger conditions** (verbatim from `app/(tabs)/_layout.tsx`): `isAuthenticated && !subscriptionsLoading && !subscriptionsError && subscriptions.size === 0 && !subscriptionModalDismissed`.
- **Behavior:** User picks categories → optimistic subscribe; once they have ≥1, `useEffect` calls `resetSubscriptionModal()` so a future "manage interests" entry point can re-open the modal.
- **Category card variants:** 6 deterministic visual variants chosen by slug hash (`aurora`, `soft`, `outline`, `dot`, `glow`, `dark`).
- **API:** `GET /categories/subscriptions`, `POST /categories/:id/subscribe`, `DELETE /categories/:id/subscribe`.

### Threads (`app/(tabs)/index.tsx`, `app/modal.tsx`, `app/(tabs)/popular.tsx`)
- **Home** (`index.tsx`): Paginated infinite-scroll thread list, pull-to-refresh, `<NewThreadPromptCard>` as `ListHeaderComponent`, `<FilterSheet>` for category + sort filters, `<NotificationBell>` (right header, auth-gated).
- **Thread detail** (`modal.tsx`): Fetches by `slug` query param via `useThreadBySlug`, renders `<ThreadDetail>`. Accepts optional `scrollTo=comments` query param to auto-scroll to the comments section.
- **Create** (`new-thread.tsx`): Two-step flow — `pick-category` → `compose` (`useNewThread` state machine). Media attachments (up to 4 images), anonymous toggle, zod `newThreadSchema` validation. Camera/library permissions requested on mount.
- **Popular** (`popular.tsx`): Hot threads leaderboard via `useThreads({ sortBy: 'hot' })`. Three card tiers from `PopularThreadCard`:
  - **Hero** (rank #1) — large card with category color band
  - **Featured** (rank #2 / #3) — gold/silver podium tints
  - **Compact** (rank #4+) — dense list rows
- **Anonymous posting**: Toggle in the compose step; routes to `POST /threads/anonymous`.
- **Media upload**: 2-step flow — `POST /media/presign` → PUT to `upload_url` → attach `file_url` to thread.
- **Sharing**: System share via `Share` API on thread cards and detail.
- **Reactions**: `<ReactionBar>` with long-press to open the floating emoji picker; tap to toggle. See Reactions below.
- **Admin delete**: `<ActionMenu>` on `<ThreadDetail>` exposes admin delete via `useDeleteThreadAsAdmin`.

### Comments (`components/comments/`)
- **`<CommentSection>`**: Paged load-more (10 at a time) with admin delete capability via `useDeleteCommentAsAdmin`.
- **`<CommentRow>`**: Single comment with avatar, body, timestamp (Spanish locale), reactions, and `<ActionMenu>` for delete.
- **`<CommentComposer>`**: Inline composer with 1000 char limit; disabled state with `ActivityIndicator` while posting.
- **Nested replies**: Displayed as flat chronological list under the parent comment.

### Reactions (`components/reactions/reaction-bar.tsx`)
- **Long-press to open picker**: `PanResponder` captures drag-to-select-emoji from a spring-animated floating modal picker.
- **Tap existing reaction to toggle**.
- **Optimistic updates** via `useReactionStore` (`reactions: Record<key, id|null>`).
- **Auth-gated**: Non-authenticated users are prompted to log in.
- **Sub-components**: `ReactionPills` (chip row), `CompactReactions` (compact summary).
- **Reaction types**: Loaded from `GET /reactions/types`; falls back to a hard-coded 7-emoji list if the request fails.

### Games (`app/(tabs)/games.tsx`)
- **What it is:** In-app mini-games tab. Three games currently: Truth or Dare, Drink Roulette, Never Have I Ever.
- **Layout:** 2-column grid of `<GameCard>` tiles + a 4th "Sube tus cartas" community card that pushes `/new-thread`.
- **Modal host:** Tapping a tile opens `<GameModal>` (full-screen slide-up), which dispatches to the matching organism via a `renderGame()` switch. Drink Roulette currently shows an `InConstruction` placeholder.
- **Shared sub-components** (in `components/games/`): `card-flip`, `deck-action-bar`, `intensity-chip`, `intensity-dots`, `progress-bar`, `session-complete`, `empty-state` — keep the three game organisms visually consistent.
- **Intensity levels:** `suave`, `medio`, `extremo` (green/amber/red) shared via `lib/game-intensity.ts`.
- **Data:** Static starter cards from `lib/games-data.ts` (~50 each for Truth/Dare and NHIE). Hooks (`useTruthOrDareCards`, `useNeverHaveIECards`) return them in a query-shaped envelope `{ status: 'success', cards, total }` so a future API swap is non-breaking.
- **Re-shuffle on filter change:** Game organisms use a signature ref to re-shuffle when category or intensity changes.

### Account (`app/(tabs)/explore.tsx` — legacy filename)
- **What it is:** Profile screen with name editing, theme toggle, admin entry point, and logout.
- **Name editing:** Inline `Controller` with `react-hook-form` + zod (`updateNameSchema` from `lib/schemas/user.ts`); `useUpdateUserName()` → `PATCH /users/:id/name`; on success both the React Query cache `['auth','me']` and `useAuthStore` are patched so header avatars update immediately.
- **Theme toggle:** `<ThemeToggleButton>` (light/dark/system).
- **Copyable text:** `<CopyableText>` for the app version (`v{version}` from `constants/version.ts`) — long-press to copy with haptic + visual feedback.
- **Logout:** `useAuthStore().logout()` + `router.replace('/login')`.
- **Admin:** `Shield` icon → `router.push('/admin/domains')` — **note:** this route is referenced but not yet implemented (see Known Inconsistencies).

### Notifications
- **In-app notification center:** Full-screen `<NotificationCenter>` modal at `/modal-notifications`. Paginated list (`useNotificationCenter`, page size 20, 60 s refetch), "Marcar todas leídas" action, "Cerrar" button.
- **Header bell:** `<NotificationBell>` shows unread count badge (max "9+") via `useUnreadNotificationCount()`. Tapping opens the notification center modal (auth-gated).
- **Per-row UI:** `<NotificationRow>` with 4 type variants (`new_comment`, `new_reaction`, `delete_thread_by_admin`, `delete_comment_by_admin`). Admin actions show 🛡️ in place of the sender avatar. Tap → mark read → `router.back()` + 200 ms delay → `router.push('/modal-redirect?id=…')`.
- **UUID resolution:** `modal-redirect` calls `useThreadById(id)` then `router.replace('/modal?slug=…')`.
- **Deep link payload** (see Deep Linking): `buildDeepLinkFromNotification()` returns `/modal-redirect?id=…` for `reaction`/`comment`, falls through to `/` for `new_thread`/`system`.

### Media Uploads (NEW)
- **WhatsApp-style camera:** `components/molecule/whatsapp-camera.tsx` — full-screen camera with gallery bottom sheet (camera + photo library permissions, recent photos strip, full gallery with pagination, mime-type detection).
- **Permission gating:** `useMediaPermissions({ requestOnMount })` — camera + photo-library permission flow with auto-request, can-ask-again detection, "Open settings" alert.
- **Picker:** `launchMediaPicker('camera' | 'gallery')` — single shot from camera, up to 4 images from gallery, JPEG quality 0.85.
- **2-step upload:** `useMediaUpload()` — `POST /media/presign` → PUT to returned `upload_url` → returns final `file_url`. Targets: `thread`, `comment`, `avatar`.
- **Helpers:** `lib/media.ts` — `getMediaType(url)` (image/audio/video/unknown from extension), `normalizeMediaUrls(urls)` (drops unknowns).

### Admin (NEW)
- **What it is:** Moderator surface for content removal; an admin domains entry point.
- **Auth:** API client prefers the `hilo_token_admin_raaaa` admin bearer over the user token when present (used for moderator actions). The admin token is stored in SecureStore under `hilo_token_admin_raaaa` and is separate from the user token.
- **Content moderation:** `useDeleteThreadAsAdmin()` → `DELETE /threads/:id/by-admin`; `useDeleteCommentAsAdmin()` → `DELETE /comments/:id/by-admin`. UI exposed via `<ActionMenu>` on `<ThreadDetail>` and `<CommentRow>`.
- **Admin domains:** `Shield` icon in the Account tab → `router.push('/admin/domains')` (route is referenced but the screen is not yet implemented — see Known Inconsistencies).

### Deep Linking

**Schemes** (verified from `app.json`):
- **Custom**: `hilos-unsaac://` (Android `intentFilters`).
- **Universal**: `https://hilos.unsaac.com/...` (`autoVerify` on Android; iOS `associatedDomains: applinks:hilos.unsaac.com`).

**Supported Routes**:
| URL | Route File | Description |
|-----|------------|-------------|
| `hilos-unsaac://modal?slug=xxx` | `app/modal.tsx` | Thread detail modal |
| `hilos-unsaac://new-thread` | `app/new-thread.tsx` | Create new thread |
| `hilos-unsaac://login` | `app/(auth)/login.tsx` | Login screen |
| `https://hilos.unsaac.com/t/:slug` | `app/modal.tsx` (via `/modal?slug=:slug`) | Thread detail via web link (Android `pathPrefix: /t` → rewritten by `+native-intent.tsx`) |
| `hilos-unsaac://modal-redirect?id=…` | `app/modal-redirect.tsx` | UUID → slug resolver (used by notifications) |

**Auth-Gate Flow** (consolidated):
1. User taps deep link → app opens.
2. `useDeepLink()` (in `AppServices`, root) parses the URL via `services/navigation-service.ts#resolveExternalRoute`.
3. If the target is a **protected route** (`PROTECTED_ROUTES = ['new-thread']`) and the user is **not authenticated** → stash in `useDeepLinkStore.pendingDeepLink` → redirect to `/login`.
4. On successful auth, `app/(auth)/_layout.tsx` reads `pendingDeepLink` and replays it.
5. Cold start is delegated to Expo Router via the `app.json` `linking` config; Android `/t/:slug` is rewritten to `/modal?slug=:slug` by `app/+native-intent.tsx`'s `redirectSystemPath`.

**Key Files**:
- `hooks/use-deep-link.ts` — Runtime + auth gate (consolidated from the old 3-hook split).
- `store/deep-link-store.ts` — Pending link state.
- `app/+native-intent.tsx` — Android deep link rewrite (`/t/:slug` → `/modal?slug=:slug`).
- `services/navigation-service.ts` — Pure URL → route resolver: `resolveExternalRoute`, `normalizePathname`, `isProtectedRoute`, `isPublicRoute`, `NotificationData` discriminated union, `buildDeepLinkFromNotification`.
- `app/(auth)/_layout.tsx` — Post-login redirect to pending link.

### Push Notifications

**Architecture**: Hybrid system using Expo Notifications + Expo Push Tokens for reliable delivery.

**Flow**:
```
[Server Event] → [Expo Push API] → [APNs/FCM] → [Device]
```

**Behaviors**:
| App State | Notification | Tap Action |
|-----------|--------------|------------|
| Foreground | Banner displayed, `addNotificationReceivedListener` fires | Direct navigation via `navigateFromNotification` |
| Background | System notification | App wakes, listener redirects to thread |
| Killed | System notification via APNs/FCM | Cold start, `getInitialNotification` redirects |

**Notification Data Payload** (discriminated union from `services/navigation-service.ts`):
```typescript
type NotificationData =
  | { type: 'reaction'; targetType: 'thread' | 'comment'; targetID: string; url?: string }
  | { type: 'comment'; threadID: string; url?: string }
  | { type: 'new_thread'; url?: string }
  | { type: 'system'; url?: string };
```

`buildDeepLinkFromNotification()` returns `/modal-redirect?id=…` for `reaction`/`comment`, falls through to `/` for `new_thread`/`system`.

**Key Components**:
- `hooks/use-notifications.ts` — Token registration, permission handling, foreground/background/cold-boot listeners. Uses a `handledNotificationId` ref to prevent double navigation on cold-boot tap.
- `hooks/use-notification-center.ts` — Inbox fetch, mark-read, mark-all-read mutations.
- `app/modal-notifications.tsx` — Full-screen notification center.
- `components/notifications/notification-bell.tsx` — Header bell with unread badge.
- `components/notifications/notification-row.tsx` — Single inbox row.
- `services/notification-service.ts` — Parse + dispatch incoming notification data.
- `services/push-notification-service.ts` — Token registration: `registerForPushNotifications()` (creates Android channel, requests permission, returns `getExpoPushTokenAsync({ projectId })`), `syncPushTokenWithServer(tokenData)`.
- `store/push-token-store.ts` — Token state (register/clear/refresh).
- `lib/project-id.ts` — Expo project ID retrieval (with hard-coded fallback `'forounsaac-mobile'`).

**API Integration**:
- `POST /push-tokens` — Register device token.
- `DELETE /push-tokens` — Unregister device token (called on logout).
- `POST /push-token/refresh` — Refresh expired token. **Note the singular `push-token` here** — see Known Inconsistencies.

**Best Practices**:
- Debounce/throttle reactions to avoid notification spam (3-5 sec window recommended).
- Group multiple reactions into a single notification.
- The `url` field in the data payload is used as a fallback for `system` / unknown notification types.
- Handle in-app notifications via `inApp: true` flag for foreground display.

---

## Key Patterns & Conventions

### File Naming
- **Files**: kebab-case (e.g., `thread-card.tsx`, `use-threads.ts`).
- **Directories**: kebab-case.

### Component Patterns (Atomic Design)
```
ui/              → Atoms (IconSymbol, AppModal, FormField)
molecule/        → Small molecules (action-menu, copyable-text, whatsapp-camera, theme-toggle-button)
threads/         → Organisms (ThreadCard, ThreadDetail, NewThreadPanel, PopularThreadCard…)
comments/        → Organisms (CommentSection, CommentRow, CommentComposer)
reactions/       → Molecules (ReactionBar)
games/           → Game organisms + shared sub-components
subscriptions/   → SubscriptionModal, CategoryCard
notifications/   → NotificationBell, NotificationRow
```

### Themed Components
- Use `useTheme()` from `@react-navigation/native`.
- Wrap with `ThemedView` and `ThemedText` for dynamic styling.
- Theme-aware colors via `useThemeColor` hook.

### API Client (`api/index.ts`)
- Custom fetch-based client with interceptors.
- Auth routes bypass token for public endpoints (`AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/verify-otp', '/auth/refresh']`).
- Automatic token refresh on 401, retries request once.
- Admin token (`hilo_token_admin_raaaa`) is preferred over the user token when present, used for moderator actions.
- Error handling via `ApiError` class with `status` and `payload`.
- Safe parsing handles both JSON and text responses.

```typescript
apiClient.get<T>(path, options)
apiClient.post<T>(path, body, options)
apiClient.put<T>(path, body, options)
apiClient.patch<T>(path, body, options)
apiClient.delete<T>(path, options)
```

### Hook Patterns
- Custom hooks in `hooks/` directory.
- Mutations use `onSuccess` to update stores/queries.
- Queries use `useInfiniteQuery` for paginated data.
- Form validation uses zod schemas from `lib/schemas/` with `react-hook-form`'s `zodResolver` (e.g., `useUpdateUserName`, all auth screens).
- Service layer (`services/`) holds pure (testable) helpers with no React dependencies — keep route classification and notification-data parsing out of hooks when possible.

### Normalization
- API data transformation via normalization functions.
- `normalizeThread`, `normalizeMediaUrls` for robustness.
- Fallback values for missing data.

### Pager Locking
- Child screens (e.g., `ThreadMediaGallery`) call `useTabBar().lockPager()` while a horizontal scroll/carousel is being dragged, so the outer PagerView does not steal the gesture.
- Always pair with `unlockPager()` on release (consider `useEffect` cleanup).

---

## API Design

### Auth Endpoints
- `POST /auth/login` - Login with email/password
- `POST /auth/register` - Register new user
- `POST /auth/verify-otp` - Verify OTP code
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Validate token and get user
- `POST /auth/refresh` - Refresh access token (in `AUTH_ROUTES`; used by the 401-retry path in `api/index.ts`)

### Thread Endpoints
- `GET /threads` - List threads (paginated, supports `sortBy: 'latest' | 'hot'`, `category` filter)
- `GET /threads/:slug` - Get thread by slug
- `GET /threads/:id` - Get thread by UUID (used by `modal-redirect` to resolve to a slug)
- `POST /threads` - Create thread (authenticated)
- `POST /threads/anonymous` - Create anonymous thread
- `DELETE /threads/:id` - Delete own thread
- `DELETE /threads/:id/by-admin` - Admin moderation delete

### Comment Endpoints
- `GET /threads/:id/comments` - List comments (paginated)
- `POST /threads/:id/comments` - Add comment
- `DELETE /comments/:id` - Delete own comment
- `DELETE /comments/:id/by-admin` - Admin moderation delete

### Reaction Endpoints
- `GET /reactions/types` - All reaction types
- `GET /threads/:id/reactions` - Reactions on a thread
- `GET /comments/:id/reactions` - Reactions on a comment
- `POST /threads/:id/reactions` - Add reaction to thread
- `POST /comments/:id/reactions` - Add reaction to comment
- `DELETE /threads/:id/reactions/:reactionTypeId` - Remove reaction from thread
- `DELETE /comments/:id/reactions/:reactionTypeId` - Remove reaction from comment

### Category Endpoints
- `GET /categories` - List all categories
- `GET /categories/subscriptions` - List user's subscribed categories
- `POST /categories/:id/subscribe` - Subscribe to a category
- `DELETE /categories/:id/subscribe` - Unsubscribe from a category

### Notification Endpoints
- `GET /notifications?page=N` - Paginated notification inbox (returns `{ items, unread_count, page, total_pages }`)
- `PUT /notifications/:id/read` - Mark a single notification as read
- `PUT /notifications/read-all` - Mark all notifications as read

### Media Endpoints
- `POST /media/presign` - Get a presigned upload URL; client uploads directly to the returned `upload_url` and attaches the resulting `file_url` to a thread / comment / avatar.

### User Endpoints
- `PATCH /users/:id/name` - Update the current user's display name. On success the API client patches both the React Query cache `['auth','me']` and `useAuthStore` so header avatars update immediately.

### Push Notification Endpoints
- `POST /push-tokens` - Register device push token
- `DELETE /push-tokens` - Unregister device push token
- `POST /push-token/refresh` - Refresh expired token (**singular `push-token` here — see Known Inconsistencies**)

---

## Security

- Tokens stored in SecureStore (encrypted). User token: `foro_token`. Admin token: `hilo_token_admin_raaaa`.
- Auth routes bypass token for public endpoints only (`AUTH_ROUTES` in `api/index.ts`).
- Admin token is separate from the user token; the API client prefers the admin token when present for moderator actions.
- Automatic token refresh on 401 (single retry).
- Push tokens cleared on logout via `useAuthStore.logout` → `usePushTokenStore.clearPushToken()`.
- No sensitive data in Zustand stores (user info only).
- `isUuid` / `assertUuid` in `lib/validation.ts` guard against malformed IDs before issuing subscription / thread-detail / user-name requests.

---

## Good Practices

1. **Use `@/` alias** for all project imports (components, hooks, constants).
2. **Themed components first**: Use `ThemedView` and `ThemedText` instead of raw `View`/`Text`.
3. **Zustand for client state**: Auth, theme, UI state. React Query for server state.
4. **Optimistic updates**: Use Zustand reaction store for instant UI feedback; mirror to React Query via `onSuccess`.
5. **File naming**: Always kebab-case for files and directories.
6. **Form validation**: Use zod schemas in `lib/schemas/` with `react-hook-form`'s `zodResolver`. `<FormField>` (`components/ui/form-field.tsx`) is the standard labeled TextInput with error display.
7. **Haptic feedback**: `Light` for tab nav / real swipe, `Medium` for primary actions (FAB, destructive confirm), `selectionAsync()` for filter chips.
8. **Tab icons**: The current `(tabs)/_layout.tsx` uses `lucide-react-native` icons inline. `components/ui/icon-symbol.tsx` (with the iOS variant `icon-symbol.ios.tsx`) is still used elsewhere as a cross-platform SF Symbols → Material Icons mapping.
9. **Typed routes**: `app.json` has `typedRoutes: true` and `reactCompiler: true` — keep Expo Router file names and generated route types in sync.
10. **New Architecture**: `newArchEnabled: true` — don't use legacy Bridge APIs.
11. **Auth guard pattern**: Use `app/(auth)/_layout.tsx` redirect pattern for protected routes.
12. **API error handling**: Use `ApiError` class, handle both JSON and text responses.
13. **Global side effects**: `useDeepLink()` and `useNotifications()` are mounted once at the root via `<AppServices />` (in `app/_layout.tsx`). Do not call them in individual screens.
14. **Deterministic visual identity**: Use `lib/category-style.ts` (`hashSlug`, `getCategoryIcon`, `getCategoryVariant`) for any category-tinted UI; never hard-code colors per slug.

---

## Development Workflow

```bash
npm run dev        # Start development server
npm start          # Alternative start command
npm run android    # Build for Android
npm run ios        # Build for iOS
npm run web        # Build for web
npm run lint       # Run linter before handoff
npm run reset-project  # Reset to starter template (use with caution)
npx expo prebuild # Regenerate native iOS / Android projects (rare; only when adding new native modules)
```

---

## Important Notes

- **Expo SDK docs**: Always reference https://docs.expo.dev/versions/v54.0.0/ before writing code.
- **Planning docs**: `docs/MOBILE_DOC_PLAN_REACT_NATIVE.md` (architecture background) and `docs/02-NEW_ENDPOINTS.md` (endpoint reference) are reference material, not implemented architecture.
- **Route types**: When renaming/adding screens, keep Expo Router file names and generated route types in sync.
- **Icon mapping**: `components/ui/icon-symbol.tsx` (with `icon-symbol.ios.tsx`) maps SF Symbols to Material Icons for cross-platform usage; the new `(tabs)/_layout.tsx` uses `lucide-react-native` directly for tab icons.
- **Global hooks**: `useDeepLink()` and `useNotifications()` are mounted once at the root via `<AppServices />` in `app/_layout.tsx`. Do not call them in individual screens.
- **Pager lock**: Pages with horizontal scrollers (e.g., `ThreadMediaGallery`) must call `lockPager()` on drag start and `unlockPager()` on release to prevent the tab swipe from stealing the gesture.

---

## Known Inconsistencies & Tech Debt

These items are documented as known issues. The next refactor pass should resolve them, but for now they are reflected accurately in this file.

1. **Deep link scheme mismatch** — older docs and this file's earlier versions referenced `hilos.unsaac.app://`; the app actually uses `hilos-unsaac://` (custom) and `https://hilos.unsaac.com/...` (universal). The universal host is `hilos.unsaac.com` (not `hilos.unsaac.app`).
2. **Push token endpoint plural vs singular** — register/unregister use plural `/push-tokens`; refresh uses singular `/push-token/refresh`. Standardize on plural in a future refactor.
3. **`app/(tabs)/explore.tsx` is the Account screen** — the filename is legacy. A rename to `account.tsx` would also require updating the `key="explore"` in the PagerView at `app/(tabs)/_layout.tsx:161` and any tab-index references.
4. **`app/admin/domains` is referenced but not implemented** — the `Shield` link in the Account tab currently routes to a non-existent screen; either implement the route or remove the link from `app/(tabs)/explore.tsx`.
5. **`components/haptic-tab.tsx` is an orphan** — the file still exists at the components root but the new `(tabs)/_layout.tsx` uses inline `Pressable`. Safe to delete.
6. **Logout error handling** — `useAuthStore.logout` swallows `POST /auth/logout` network failures in a `try/catch` so the local session always clears, but this means a failed server-side logout is silent. Consider surfacing a non-blocking toast in a future refactor.

---

## File Reference

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root layout: providers, Stack navigator, `<AppServices />` (mounts `useDeepLink`, `useNotifications`) |
| `app/(tabs)/_layout.tsx` | Custom PagerView + BlurView tab bar + center FAB + `<SubscriptionModal>` overlay |
| `app/(tabs)/index.tsx` | Home — thread list with `FilterSheet`, `NotificationBell`, infinite scroll |
| `app/(tabs)/popular.tsx` | Popular — hot threads leaderboard with 3-tier `PopularThreadCard` |
| `app/(tabs)/games.tsx` | Games — 2-column grid of game cards + "Sube tus cartas" CTA |
| `app/(tabs)/explore.tsx` | Account — profile, name editing, theme toggle, admin link, logout (**legacy filename**) |
| `app/(auth)/_layout.tsx` | Auth guard: redirect if logged in; replays `pendingDeepLink` post-auth |
| `app/modal.tsx` | Thread detail modal (accepts `?slug=` and `?scrollTo=comments`) |
| `app/modal-redirect.tsx` | UUID → slug resolver for notification deep links |
| `app/modal-notifications.tsx` | Full-screen notification center |
| `app/new-thread.tsx` | New thread creation modal |
| `app/+native-intent.tsx` | Android `redirectSystemPath` (`/t/:slug` → `/modal?slug=:slug`) |
| `providers/app-providers.tsx` | QueryClient, ThemeProvider, DialogProvider |
| `providers/dialog-provider.tsx` | `openDialog` / `closeDialog` context (queue-less, last-one-wins) |
| `providers/tab-bar-context.tsx` | `<TabBarProvider>` + `useTabBar()` — `tabBarHeight`, `isPagerLocked`, `lockPager`, `unlockPager` |
| `store/auth-store.ts` | Auth state with `initialize` / `login` / `setUser` / `logout` (also clears push tokens + reactions) |
| `store/theme-store.ts` | Theme preference management |
| `store/push-token-store.ts` | Push token state (register/clear/refresh) |
| `store/deep-link-store.ts` | `pendingDeepLink` for post-auth replay |
| `store/onboarding-store.ts` | `subscriptionModalDismissed` flag |
| `store/reaction-store.ts` | Local reaction cache (optimistic UI) |
| `store/reaction-picker-store.ts` | Reaction picker UI state |
| `services/navigation-service.ts` | Pure URL → route resolver (`resolveExternalRoute`, `isProtectedRoute`, `buildDeepLinkFromNotification`) |
| `services/notification-service.ts` | Parse + dispatch notification data |
| `services/push-notification-service.ts` | Push token registration (channel creation, permission, server sync) |
| `api/index.ts` | Fetch-based API client with token refresh + 401 retry + admin token precedence |
| `hooks/use-auth.ts` | Auth mutations: login, register, verify-otp |
| `hooks/use-threads.ts` | Thread list, by-slug, by-id, admin delete, create, infinite scroll |
| `hooks/use-comments.ts` | Comments list, create, delete (+ admin variants) |
| `hooks/use-reactions.ts` | Reaction types + per-target add/remove with optimistic UI |
| `hooks/use-categories.ts` | GET /categories |
| `hooks/use-subscriptions.ts` | Subscriptions Set + subscribe/unsubscribe |
| `hooks/use-notification-center.ts` | Inbox: paginated, mark-read, mark-all-read |
| `hooks/use-notifications.ts` | OS-level listeners, token registration, cold-boot tap handling |
| `hooks/use-deep-link.ts` | Consolidated deep link: runtime + auth gate + replay |
| `hooks/use-users.ts` | `PATCH /users/:id/name` with cache + store patching |
| `hooks/use-game-cards.ts` | Static Truth/Dare + NeverHaveIEver card decks (query-shaped) |
| `hooks/use-media-permissions.ts` | Camera + library permission gating |
| `hooks/use-media-picker.ts` | `launchMediaPicker('camera' \| 'gallery')` |
| `hooks/use-media-upload.ts` | 2-step upload: presign + PUT |
| `hooks/use-new-thread.ts` | Create-thread state machine (pick-category → compose) |
| `hooks/use-theme-color.ts` | Theme-aware color access |
| `hooks/use-color-scheme.ts` | RN passthrough |
| `components/comments/comment-section.tsx` | Paginated comment list with admin delete |
| `components/comments/comment-row.tsx` | Single comment with reactions + `ActionMenu` |
| `components/comments/comment-compose.tsx` | Inline comment composer |
| `components/reactions/reaction-bar.tsx` | Gesture-based reaction picker (long-press → drag-to-select) |
| `components/threads/thread-card.tsx` | Standard thread card (reactions, comments, share) |
| `components/threads/thread-detail.tsx` | Full thread view with comments + admin delete |
| `components/threads/thread-media-gallery.tsx` | Paged horizontal media carousel (uses `useTabBar` for pager lock) |
| `components/threads/popular-thread-card.tsx` | 3-tier card: hero / featured / compact |
| `components/threads/filter-sheet.tsx` | Animated left drawer for category + sort filters |
| `components/threads/new-thread-card.tsx` | Editable preview card for thread composer |
| `components/threads/new-thread-compose.tsx` | Media thumbnails + toolbar (camera/gallery/anonymous) |
| `components/threads/new-thread-panel.tsx` | Two-step create-thread flow (pick-category → compose) |
| `components/threads/new-thread-prompt-card.tsx` | Top-of-list CTA card to create a new thread |
| `components/games/game-modal.tsx` | Full-screen host that dispatches to game organisms |
| `components/games/game-card.tsx` | Grid tile for a single game |
| `components/games/truth-or-dare-game.tsx` | "Verdad o Reto" card-deck game |
| `components/games/drink-roulette.tsx` | Spinning-wheel picker (currently `InConstruction` placeholder) |
| `components/games/never-have-i-ever.tsx` | "Yo Nunca" filtered card deck |
| `components/games/{card-flip,deck-action-bar,intensity-chip,intensity-dots,progress-bar,session-complete,empty-state}.tsx` | Shared sub-components for game organisms |
| `components/subscriptions/subscription-modal.tsx` | Onboarding bottom sheet (anim slide-up, optimistic selection) |
| `components/subscriptions/category-card.tsx` | Subscription card with 6 deterministic visual variants |
| `components/notifications/notification-bell.tsx` | Header bell with unread badge |
| `components/notifications/notification-row.tsx` | Single inbox row (4 type variants) |
| `components/molecule/action-menu.tsx` | Reusable bottom-sheet action menu (⋯ button) |
| `components/molecule/copyable-text.tsx` | Long-press to copy with haptic + visual feedback |
| `components/molecule/whatsapp-camera.tsx` | Full-screen WhatsApp-style camera with gallery strip |
| `components/molecule/theme-toggle-button.tsx` | Round button to toggle dark/light theme |
| `components/ui/app-modal.tsx` | Generic dialog modal (`default \| destructive \| secondary`) |
| `components/ui/form-field.tsx` | Labeled `TextInput` with error display (zod-aware) |
| `components/ui/icon-symbol.tsx` | Cross-platform icon (MaterialIcons on Android/web) |
| `components/ui/icon-symbol.ios.tsx` | iOS-specific `SymbolView` variant |
| `components/themed-text.tsx` | Dynamic text color from theme; semantic type variants |
| `components/themed-view.tsx` | Dynamic background (`'background' \| 'card'` variant) |
| `components/haptic-tab.tsx` | **Orphan** — file exists but the new `(tabs)/_layout.tsx` uses inline `Pressable`; safe to delete |
| `lib/auth.ts` | SecureStore token management (`foro_token`, `hilo_token_admin_raaaa`) |
| `lib/category-style.ts` | Slug → icon / variant / color (deterministic 32-bit hash) |
| `lib/game-intensity.ts` | Shared intensity constants for games |
| `lib/games-data.ts` | Static game metadata + starter cards |
| `lib/media.ts` | `getMediaType`, `normalizeMediaUrls` |
| `lib/project-id.ts` | Expo project ID (with hard-coded fallback) |
| `lib/query-client.ts` | Singleton `QueryClient` config |
| `lib/utils.ts` | `truncate`, `getAvatarInitial`, `formatRelativeTime` (es-PE) |
| `lib/validation.ts` | `isUuid`, `assertUuid` |
| `lib/schemas/auth.ts` | Zod: `loginSchema`, `registerSchema`, `verifyOtpSchema` |
| `lib/schemas/threads.ts` | Zod: `newThreadSchema` |
| `lib/schemas/user.ts` | Zod: `updateNameSchema` |
| `constants/theme.ts` | Theme colors and configuration |
| `constants/Colors.ts` | Color palette definitions |
| `constants/fonts.ts` | Font family/size scale |
| `constants/version.ts` | App version string |
| `types/index.ts` | Shared types: `Thread`, `TmpThread`, `PaginatedResponse`, `NewThreadInput`, `NotificationItem` |

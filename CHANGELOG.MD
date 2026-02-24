# v1.1.18 - 2026-02-24

## Enhancements
- Improve styles and colors for dark and light mode.
- The roles are commented in the code for the moment.

## Technical
- New types of opportunities added

# v1.1.17 - 2026-02-17

## Features
- Filter opportunities by CV: Added a new filter in the Opportunities section that allows users to select a specific CV and see only the opportunities that match that profile. This helps users find relevant job openings more efficiently.
- Search bar with debounce: Implemented a search bar in the Opportunities section that allows users to

## Fixes
- Fix colors for dark and light mode
- Fixed a bug where multiple CVs with the same name would all be highlighted simultaneously in the selection menus by integrating unique IDs into the selection logic.

# v1.1.16 - 2026-01-20

## Features
- **Advanced Opportunity Filtering**: Added a CV-specific filter in the Opportunities section to match profiles more accurately.
- **Search Functionality**: Implemented a search bar with debounce (500ms) to filter opportunities by job title or company name.
- **Improved IA Matching UX**: Created a new `QuickMatchLoadingModal` with a guaranteed 10-second simulation that shows realistic progress steps ("Analyzing profile", "Searching vacancies", etc.) for a more professional feel.

## Enhancements
- **UI Consistency**: Standardized the size and style of all action buttons in the CV Preview sidebar (Download, Analyze, Match).
- **Responsive Filters**: Improved the layout of the filter bar in the Opportunities and Evaluations screens.
- **Smarter Placeholders**: Updated empty states to provide relevant feedback when filters or search queries yield no results.

## Fixes
- **Duplicate Name Conflict**: Fixed a bug where multiple CVs with the same name would all be highlighted simultaneously in the selection menus by integrating unique IDs into the selection logic.


# v1.1.15 - 2026-02-16

## Features
- New "Quick Match" functionality in sidebar for fast opportunity search without full analysis
- Intelligent credit consumption logic for opportunity matching:
    - Charges 1 `SEARCH_OPPORTUNITIES` credit only when matches are found or for refreshing existing CV opportunities
    - No credit consumed for new CVs with no matches found (Better UX)

## Enhancements
- Updated Privacy Policy and Terms & Conditions
- Updated meetings/booking link
- Professional summary is now OPTIONAL for all CV types
- Education is MANDATORY for: Scholarships, Internships, and Exchange Programs
- Education is OPTIONAL for: Employment
- Improved navigation flow in CV creation form
- Background saving while navigating between sections
- Strict validation only on final step before preview
- Better error handling with toast notifications
- Hidden "Brochure" button in partners section
- Hidden "Resources" link in the main header navigation

# v1.1.11, v1.1.12, v1.1.13, v1.1.14 - 2025-02-06

# Fixes
- Google OAuth sign in and sign up
- Better auth for sending emails
- Auth client variable need to load before rendering the app, to avoid errors on public pages
- Fix the sending emails for google oauth users and users without password

# v1.1.10 - 2025-02-04

# Fixes
- Improve onboarding validations
- Google OAuth
- Fix buttons on public pages

# v1.1.9 - 2025-02-04

# Fixes
- Hide AIESEC logo

# v1.1.8 - 2025-02-03

# Fixes
- Test CI and CD pipelines to generate versions properly
- Fix style of name on header of user


# v1.1.7 - 2025-02-03

# Fixes
- Impossible to save credits after payment and get current credits updated

# v1.1.6

# Fixes
- It's impossible to save credits after payment

# v1.1.3, v1.1.4 and v1.1.5 - 2025-01-30

## QA
- Test CI and CD pipelines

# 1.1.2 - 2025-01-30

## Features
- Added credits package for users to purchase additional CV generations.
- Introduced new subscription plans with varying levels of access and features.
- Payment with Mercado Pago integrated.

## Enhancements
- Updated colors and logo for email sending
- Implemented a new color palette based on tokens:
    - --color-levely-blue: rgb(86 135 255)
    - --color-levely-offwhite: rgb(245 245 240)
    - --color-levely-dark: rgb(25 40 45)
    - --color-levely-green: rgb(210 255 125)
    - --color-levely-pink: rgb(255 85 245)
    - --color-levely-orange: rgb(240 90 80)
- Fully redesigned the main page and dashboard with a more modern, attractive interface aligned with Levely's identity.
- All progress bars and visual elements now use gradients and official brand colors.
- Improved responsiveness across all components and views, optimizing the experience for both mobile and desktop devices.
- Updated global styles and CSS utilities to reflect the new visual identity.
- Enhanced accessibility and contrast for key elements.
- The dashboard now features a clearer structure, improved navigation, and refreshed visual components.
- Removed generic colors and styles, centralizing visual management with the new color tokens.
- Changed the browser window .ico to a more rounded version.
- Some components may still need updating; please use the new color palette for any further changes.

# 1.1.1 - 2025-01-22

## Hotfix
- Fixed build process error related to schema modifications

# 1.1.0 - 2025-01-22

## Fixes
- [JB-86adpv36f](https://app.clickup.com/t/86adpv36f) Fixed upload CV count issue
- [JB-86adpv28j](https://app.clickup.com/t/86adpv28j) Fixed issue where changing the title was impossible
- [JB-tmp](https://app.clickup.com/t/tmp) Various bug fixes

## Technical

- [JB-86acgydd9](https://app.clickup.com/t/86acgydd9) Integrated Inngest for background processing
- [JB-86acfgked](https://app.clickup.com/t/86acfgked) Integrated Mercado Pago
- [JB-86acrwkdh](https://app.clickup.com/t/86acrwkdh) Integrated new landing page with feedback; login and register dropdown menus temporarily hidden; added /pro path with application info, plans, and demo
- Refactored the database schema for improved performance and scalability
- [JB-86acz99x8](https://app.clickup.com/t/86acz99x8) Integrated new modular structure for CV creation, dynamic form, and dynamic preview, rendering sections in order
- Modified schema: added VOLUNTEERING to CvSectionType, and renamed all CvType names for clarity
- Talent onboarding
- Email service integration



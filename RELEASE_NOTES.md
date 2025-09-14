# Release Notes

## Version 11.1.0 (September 14, 2025)

### 🚀 New Features & Improvements

#### Authentication & Security
- **Fixed login redirect issues** - Resolved "Invalid%20credentials" URL redirects that occurred on failed login attempts
- **Enhanced error handling** - Login errors now display inline on the form instead of redirecting to error pages
- **Improved authentication strategy** - Updated CustomAuthStrategy to extend NbPasswordAuthStrategy for better Nebular Auth integration
- **Security enhancements** - Proper configuration of NbAuthResult objects with redirect handling

#### Routing & Navigation
- **Fixed infinite spinner issue** - Resolved loading problems when accessing invalid/random URLs
- **Smart 404 handling** - Implemented intelligent routing where:
  - Unauthenticated users accessing invalid URLs are redirected to login
  - Authenticated users accessing invalid URLs see a proper 404 page
- **Cleaner routing structure** - Removed unnecessary redirect routes and optimized navigation flow
- **Improved user experience** - Better handling of edge cases in routing

#### Development & Maintenance
- **Git workflow optimization** - Added `package-lock.json` to `.gitignore` to prevent accidental commits
- **Dependency updates** - Updated `@swimlane/ngx-charts` to v20.1.0 with `--legacy-peer-deps` support
- **Repository cleanup** - Removed package-lock.json from version control while maintaining local development files

### 🔧 Technical Changes

#### Core Module Updates
- **`src/app/@core/core.module.ts`**
  - Configured NbAuthModule with proper redirect settings
  - Set `login.redirect.failure: null` to prevent unwanted redirects
  - Maintained successful login redirect to `/pages`

#### Authentication Strategy
- **`src/app/@core/auth/auth-strategy.ts`**
  - Changed inheritance from `NbAuthStrategy` to `NbPasswordAuthStrategy`
  - Removed manual Router dependencies to avoid conflicts with Nebular Auth
  - Updated NbAuthResult construction to use `this.getOption()` for proper configuration
  - Improved error handling and redirect management

#### Routing Configuration
- **`src/app/app-routing.module.ts`**
  - Modified wildcard route to redirect to login instead of loading MiscellaneousModule
  - Removed unnecessary `/redirect` route
  - Simplified routing structure for better performance

- **`src/app/pages/miscellaneous/miscellaneous-routing.module.ts`**
  - Added proper 404 route configuration within miscellaneous module
  - Configured empty path redirect to 404 component

### 🐛 Bug Fixes
- Fixed authentication redirect loop issues
- Resolved infinite loading spinner on invalid routes
- Corrected Nebular Auth strategy implementation
- Fixed npm dependency conflicts with ngx-charts

### 📚 Documentation
- **Updated README.md** with project-specific information
- **Added installation instructions** with `--legacy-peer-deps` flag
- **Documented recent improvements** and technical features
- **Added development setup guide** and project structure overview

### 🔄 Breaking Changes
None. This release maintains backward compatibility.

### 📦 Dependencies
- Updated `@swimlane/ngx-charts` to v20.1.0
- Requires `npm install --legacy-peer-deps` for installation

### 🚀 Migration Guide
No migration needed. Existing installations will benefit from:
1. Better authentication error handling
2. Improved routing behavior
3. Cleaner development workflow

---

## Previous Versions

### Version 11.0.0
- Initial Angular 15 setup
- Nebular Auth integration
- Basic library management features
- Dashboard implementation
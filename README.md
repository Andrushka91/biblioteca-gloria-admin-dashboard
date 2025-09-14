# Biblioteca Gloria Admin Dashboard

Admin dashboard for Biblioteca Gloria based on Angular and <a href="https://github.com/akveo/nebular">Nebular</a>

<a target="_blank" href="https://demo.akveo.com/ngx-admin/pages/dashboard?theme=corporate&utm_campaign=ngx_admin%20-%20demo%20-%20ngx_admin%20github%20readme&utm_source=ngx_admin&utm_medium=referral&utm_content=hero_banner_corporate"><img src="https://i.imgur.com/mFdqvgG.png"/></a>

## 🚀 Recent Updates (v11.1.0)

### Authentication & Security Improvements
- ✅ **Fixed login redirect issues** - No more "Invalid%20credentials" URL redirects
- ✅ **Enhanced error handling** - Login errors now display inline on the form
- ✅ **Improved user experience** - Proper authentication flow with Nebular Auth
- ✅ **Security enhancements** - Updated auth strategy to extend NbPasswordAuthStrategy

### Routing & Navigation
- ✅ **Fixed infinite spinner** - Resolved loading issues on invalid URLs
- ✅ **Smart 404 handling** - Unauthenticated users redirect to login, authenticated users see 404 page
- ✅ **Cleaner routing** - Removed unnecessary redirect routes and improved navigation flow

### Development Improvements
- ✅ **Git workflow optimization** - Added package-lock.json to .gitignore
- ✅ **Dependency updates** - Updated ngx-charts to v20.1.0 with legacy peer deps support

## Installation notes

To install this project you have to use NodeJS version 14.14+ because of [node-sass](https://github.com/sass/node-sass) version utilized in the application.

```bash
npm install --legacy-peer-deps
npm start
```

## Features

### Library Management System
- 📚 **Book Management** - Complete CRUD operations for library books
- 👥 **User Authentication** - Secure login/logout with role-based access
- 📊 **Dashboard Analytics** - Overview of library statistics and metrics
- 🔍 **Search & Filter** - Advanced book search and filtering capabilities

### Technical Features
- **Angular 15** with TypeScript
- **Nebular UI Library** for consistent design
- **Bootstrap 4+** & SCSS for responsive styling
- **Authentication Module** with multiple providers
- **Responsive Layout** with mobile support
- **Hot-reload** development server
- **40+ Angular Components** ready to use

## Available Themes

The dashboard comes with multiple beautiful themes powered by Nebular:

| <a target="_blank" href="https://demo.akveo.com/ngx-admin/pages/dashboard?theme=dark&utm_campaign=ngx_admin%20-%20demo%20-%20ngx_admin%20github%20readme&utm_source=ngx_admin&utm_medium=referral&utm_content=github_readme_theme_dark"><img src="https://i.imgur.com/9UkTGgr.png"/></a> | <a target="_blank" href="https://demo.akveo.com/ngx-admin/pages/dashboard?theme=default&utm_campaign=ngx_admin%20-%20demo%20-%20ngx_admin%20github%20readme&utm_source=ngx_admin&utm_medium=referral&utm_content=github_readme_theme_default"><img src="https://i.imgur.com/Kn3xDKQ.png"/></a> |
| --- | --- |
|  Dark Theme | Light Theme |

| <a target="_blank" href="https://demo.akveo.com/ngx-admin/pages/dashboard?theme=cosmic&utm_campaign=ngx_admin%20-%20demo%20-%20ngx_admin%20github%20readme&utm_source=ngx_admin&utm_medium=referral&utm_content=github_readme_theme_cosmic"><img src="https://i.imgur.com/iJu2YDF.png"/></a> | <a target="_blank" href="https://demo.akveo.com/ngx-admin/pages/dashboard?theme=corporate&utm_campaign=ngx_admin%20-%20demo%20-%20ngx_admin%20github%20readme&utm_source=ngx_admin&utm_medium=referral&utm_content=github_readme_theme_corporate"><img src="https://i.imgur.com/GpUt6NW.png"/></a> |
| --- | --- |
| Cosmic Theme | Corporate Theme |

## Development

### Prerequisites
- Node.js 14.14+
- npm or yarn

### Getting Started
```bash
# Clone the repository
git clone https://github.com/Andrushka91/biblioteca-gloria-admin-dashboard.git

# Install dependencies
cd biblioteca-gloria-admin-dashboard
npm install --legacy-peer-deps

# Start development server
npm start

# Build for production
npm run build:prod
```

### Scripts
- `npm start` - Start development server
- `npm run build` - Build the application
- `npm run build:prod` - Build for production with AOT
- `npm test` - Run unit tests
- `npm run lint` - Run linting
- `npm run test:coverage` - Run tests with coverage report

### Project Structure
```
src/
├── app/
│   ├── @core/           # Core services and authentication
│   ├── @theme/          # UI theme and components
│   ├── auth/            # Authentication pages
│   ├── pages/           # Main application pages
│   │   ├── books/       # Book management module
│   │   ├── dashboard/   # Dashboard pages
│   │   └── ...
│   └── models/          # Data models
├── assets/              # Static assets
└── environments/        # Environment configurations
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Angular](https://angular.io/)
- UI components from [Nebular](https://akveo.github.io/nebular/)
- Based on [ngx-admin](https://github.com/akveo/ngx-admin) template

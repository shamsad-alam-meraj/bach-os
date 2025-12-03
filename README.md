# BachOS - Bachelor Meal Management System

A modern, responsive web application for managing bachelor meal groups with real-time expense tracking, member management, and offline support. Built with Next.js and designed for mobile-first experience.

## Features

### Core Features

- **User Authentication**: Secure JWT-based authentication
- **Mess Management**: Create and manage meal groups
- **Member Management**: Add and manage group members
- **Meal Tracking**: Log daily meals (breakfast, lunch, dinner)
- **Expense Tracking**: Record and categorize expenses
- **Analytics**: Visual charts and statistics
- **Settlement Reports**: Calculate member balances
- **Mobile Responsive**: Optimized for mobile devices

### PWA Features

- **Offline Support**: Works without internet connection
- **Installable**: Install as native app on mobile/desktop
- **Service Worker**: Automatic caching and sync
- **Offline Data Sync**: Automatic sync when back online

### Technical Features

- **Next.js 16**: Latest React framework with App Router
- **React 19**: Modern React with new features
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Modern styling with responsive design
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Interactive data visualizations
- **React Hook Form**: Efficient form handling
- **Zod**: Schema validation

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/bach-os.git
   cd bach-os
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Setup environment variables**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local if needed (API URL is already configured)
   \`\`\`

4. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open Application**
   - Frontend: http://localhost:3000

## Documentation

For detailed API documentation, please refer to the backend repository or contact the development team.

## Project Structure

\`\`\`
bach-os/
├── src/
│   ├── app/ # Next.js App Router pages
│   │   ├── auth/ # Authentication pages
│   │   ├── dashboard/ # Protected dashboard pages
│   │   └── globals.css # Global styles
│   ├── components/ # React components
│   │   ├── ui/ # shadcn/ui components
│   │   └── Dashboard/ # Dashboard-specific components
│   ├── hooks/ # Custom React hooks
│   ├── lib/ # Utilities and helpers
│   ├── types/ # TypeScript type definitions
│   └── utils/ # Utility functions
├── public/ # Static assets and PWA files
├── .qodo/ # Testing configuration
└── package.json
\`\`\`

## Technology Stack

### Frontend

- **Next.js 16**: React framework with App Router
- **React 19**: Modern React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first CSS framework
- **shadcn/ui**: Modern UI components built on Radix UI
- **Framer Motion**: Animation library for smooth transitions
- **Recharts**: Composable charting library
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation
- **Lucide React**: Beautiful icon library

### Backend

- **Express.js**: RESTful API server
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing

### DevTools

- **ESLint**: Code linting
- **Jest**: Testing framework
- **TypeScript**: Type checking

## Key Pages

### Public Pages

- **Landing Page** (`/`) - Feature overview
- **Login** (`/auth/login`) - User authentication
- **Signup** (`/auth/signup`) - Account creation

### Protected Pages

- **Dashboard** (`/dashboard`) - Main dashboard with stats
- **Meals** (`/dashboard/meals`) - Meal tracking
- **Expenses** (`/dashboard/expenses`) - Expense management
- **Members** (`/dashboard/members`) - Member management
- **Analytics** (`/dashboard/analytics`) - Charts and insights
- **Reports** (`/dashboard/reports`) - Settlement reports
- **Profile** (`/dashboard/profile`) - User profile
- **Settings** (`/dashboard/settings`) - Mess settings

## API Endpoints

The frontend connects to a separate backend API. Here are the main endpoints used:

### Authentication

- \`POST /auth/signup\` - Create account
- \`POST /auth/login\` - Login

### Users

- \`GET /users/profile\` - Get user profile
- \`PUT /users/profile\` - Update user profile

### Mess Management

- \`POST /mess/create\` - Create new mess
- \`GET /mess\` - Get all messes (admin)
- \`GET /mess/:id\` - Get mess details
- \`POST /mess/admin/cleanup\` - Data cleanup (admin)

### Meals

- \`POST /meals\` - Add meal entry
- \`GET /meals/mess/:messId\` - Get meals for mess
- \`PUT /meals/:id\` - Update meal entry
- \`DELETE /meals/:id\` - Delete meal entry

### Expenses

- \`POST /expenses\` - Add expense
- \`GET /expenses/mess/:messId\` - Get expenses for mess
- \`PUT /expenses/:id\` - Update expense
- \`DELETE /expenses/:id\` - Delete expense

### Deposits

- \`GET /deposits/mess/:messId\` - Get deposits for mess

### Analytics & Reports

- \`GET /analytics/:messId\` - Get analytics data
- \`GET /reports/:messId\` - Get settlement reports

## Development

### Available Scripts

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npm test         # Run Jest tests
npm run test:watch # Run tests in watch mode
\`\`\`

### Environment Variables

**Frontend (.env.local):**
\`\`\`
# API Base URL (already configured for production)
NEXT_PUBLIC_API_URL=https://bachos-api.onrender.com/

# For local development, uncomment and modify:
# NEXT_PUBLIC_API_URL=http://localhost:4000/
\`\`\`

## Deployment

### Deploy to Vercel

\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

The application is configured to connect to the production API automatically. For custom deployments, update the \`NEXT_PUBLIC_API_URL\` environment variable.

## PWA Features

### Install as App

- **Desktop**: Click install button in address bar
- **Mobile**: Tap menu → Install app
- **iOS**: Share → Add to Home Screen

### Offline Support

- Works without internet
- Automatic data sync
- Offline indicator
- Service worker caching

### Test Offline Mode

1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Check "Offline"
4. App continues to work!

## Performance

- **React Compiler**: Automatic optimization
- **Turbopack**: 5x faster builds
- **PWA Caching**: Instant load times
- **Code Splitting**: Automatic route splitting
- **Image Optimization**: Next.js Image component

## Security

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation
- Environment variable protection
- HTTPS in production

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Application won't start

- Check Node.js version (18+ required)
- Verify all dependencies are installed with \`npm install\`
- Check .env.local configuration

### API connection issues

- Verify NEXT_PUBLIC_API_URL is set correctly
- Check network connectivity
- Backend API may be temporarily unavailable

### Service worker not registering

- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check DevTools → Application → Service Workers

### Mobile responsiveness issues

- Test on actual mobile devices
- Check browser zoom level
- Ensure viewport meta tag is present

## Contributing

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues and questions:

- Open an issue on GitHub
- Check documentation files
- Review API documentation

## Roadmap

- [x] Mobile responsive design
- [ ] Push notifications
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Export to PDF/Excel

## Acknowledgments

- Built with Next.js 16
- UI components from shadcn/ui
- Icons from Lucide React
- Charts from Recharts

---

**Happy Coding!** 🚀

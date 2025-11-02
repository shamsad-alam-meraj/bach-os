# Bachelor Meal Management System with PWA

A full-stack web application for managing bachelor meal groups with real-time expense tracking, member management, and offline support.

## Features

### Core Features

- **User Authentication**: Secure JWT-based authentication
- **Mess Management**: Create and manage meal groups
- **Member Management**: Add and manage group members
- **Meal Tracking**: Log daily meals (breakfast, lunch, dinner)
- **Expense Tracking**: Record and categorize expenses
- **Analytics**: Visual charts and statistics
- **Settlement Reports**: Calculate member balances

### PWA Features

- **Offline Support**: Works without internet connection
- **Installable**: Install as native app on mobile/desktop
- **Service Worker**: Automatic caching and sync
- **Offline Data Sync**: Automatic sync when back online
- **Push Notifications**: Real-time updates (coming soon)

### Technical Features

- **Next.js 16**: Latest React framework with React Compiler
- **React 19**: Modern React with new features
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Modern styling
- **Express.js**: Robust backend
- **MongoDB**: Flexible database
- **Turbopack**: Lightning-fast builds

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or pnpm

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/meal-system.git
   cd meal-system
   \`\`\`

2. **Setup Backend**
   \`\`\`bash
   cd backend
   npm install
   cp .env.example .env

   # Edit .env with your MongoDB URI

   npm run dev
   \`\`\`

3. **Setup Frontend**
   \`\`\`bash
   cd ..
   npm install
   cp .env.local.example .env.local
   npm run dev
   \`\`\`

4. **Open Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Documentation

- **[NEXT_JS_16_SETUP.md](./NEXT_JS_16_SETUP.md)** - Detailed setup guide
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute quick start
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API reference
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment

## Project Structure

\`\`\`
meal-system/
├── app/ # Next.js app directory
├── components/ # React components
├── lib/ # Utilities and helpers
├── public/ # Static assets
├── backend/ # Express backend
├── docs/ # Documentation
└── package.json
\`\`\`

## Technology Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Recharts
- React Hook Form
- Zustand

### Backend

- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS

### DevTools

- Turbopack
- React Compiler
- ESLint
- TypeScript

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

### Authentication

- \`POST /api/auth/signup\` - Create account
- \`POST /api/auth/login\` - Login

### Users

- \`GET /api/users/profile\` - Get profile
- \`PUT /api/users/profile\` - Update profile

### Mess

- \`POST /api/mess/create\` - Create mess
- \`GET /api/mess/:messId\` - Get mess details
- \`POST /api/mess/:messId/add-member\` - Add member

### Meals

- \`POST /api/meals\` - Add meal
- \`GET /api/meals/mess/:messId/month\` - Get monthly meals

### Expenses

- \`POST /api/expenses\` - Add expense
- \`GET /api/expenses/mess/:messId\` - Get expenses

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete reference.

## Development

### Available Scripts

**Frontend:**
\`\`\`bash
npm run dev # Start development server
npm run build # Build for production
npm start # Start production server
npm run lint # Run ESLint
\`\`\`

**Backend:**
\`\`\`bash
npm run dev # Start development server
npm run build # Build for production
npm start # Start production server
\`\`\`

### Environment Variables

**Frontend (.env.local):**
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

**Backend (.env):**
\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meal-system
JWT_SECRET=your_secret_key
NODE_ENV=development
\`\`\`

## Deployment

### Deploy Frontend to Vercel

\`\`\`bash
vercel
\`\`\`

### Deploy Backend to Railway

\`\`\`bash
railway up
\`\`\`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

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

### Backend won't start

- Check MongoDB is running
- Verify port 5000 is available
- Check .env configuration

### Frontend can't connect to backend

- Verify backend is running
- Check NEXT_PUBLIC_API_URL
- Check CORS configuration

### Service worker not registering

- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check DevTools → Application

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

For detailed setup instructions, see [NEXT_JS_16_SETUP.md](./NEXT_JS_16_SETUP.md)

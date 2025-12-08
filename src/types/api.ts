// API Types based on BachOS API Documentation

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'manager' | 'admin';
  phone?: string;
  dateOfBirth?: string;
  profileImage?: string;
  messId?: string;
  isDeleted: boolean;
  preferences: {
    notifications: boolean;
    language: string;
    theme: 'light' | 'dark';
  };
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface Mess {
  id: string;
  name: string;
  description?: string;
  address?: string;
  managerId: string;
  members: User[];
  mealRate: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meal {
  id: string;
  messId: string;
  userId: User;
  breakfast: number;
  lunch: number;
  dinner: number;
  date: Date;
  status: 'taken' | 'skipped' | 'guest' | 'offday';
  isGuest?: boolean;
  guestName?: string;
  mealType: 'regular' | 'offday' | 'holiday';
  preferences?: {
    vegetarian: boolean;
    spicy: boolean;
    notes?: string;
  };
  cost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  messId: string;
  description: string;
  amount: number;
  category: 'food' | 'utilities' | 'maintenance' | 'other';
  addedBy: User;
  expensedBy: User;
  date: Date;
  createdAt: Date;
}

export interface Deposit {
  id: string;
  messId: string;
  userId: User;
  amount: number;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plan {
  _id: string;
  name: string;
  description?: string;
  maxMembers: number;
  duration: number;
  price: number;
  currency: string;
  features: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicablePlans: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  messId: string;
  planId: Plan;
  couponId?: Coupon;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  paymentMethod: 'sslcommerz' | 'stripe' | 'bank_transfer' | 'cash';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardData {
  totalMeals: number;
  totalExpenses: number;
  totalMembers: number;
  currentBalance: number;
  monthlyMeals: number;
  monthlyExpenses: number;
  recentMeals: Array<{
    date: string;
    count: number;
    status: string;
  }>;
  recentExpenses: Array<{
    description: string;
    amount: number;
    date: string;
  }>;
}

export interface AnalyticsData {
  mealTrends: Array<{
    date: string;
    taken: number;
    skipped: number;
    guest: number;
  }>;
  expenseBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  memberContributions: Array<{
    memberId: string;
    name: string;
    mealsTaken: number;
    contribution: number;
  }>;
}

export interface ReportData {
  summary: {
    totalMembers: number;
    totalMeals: number;
    totalExpenses: number;
    totalDeposits: number;
    mealRate: number;
    expenseCount: number;
    mealEntries: number;
    depositCount: number;
    period: {
      start: string;
      end: string;
      month: string;
    };
    calculations: {
      expensePerMember: string;
      netBalance: number;
    };
  };
  memberReports: Array<{
    _id: string;
    name: string;
    email: string;
    totalMeals: number;
    totalDeposit: number;
    mealCost: number;
    expenseShare: number;
    balance: number;
  }>;
  detailedExpenses: Array<{
    _id: string;
    messId: string;
    description: string;
    amount: number;
    category: string;
    addedBy: {
      _id: string;
      name: string;
      email: string;
    };
    expensedBy: {
      _id: string;
      name: string;
      email: string;
    };
    date: string;
    createdAt: string;
    __v: number;
  }>;
  detailedDeposits: Array<{
    _id: string;
    messId: string;
    userId: {
      _id: string;
      name: string;
      email: string;
    };
    amount: number;
    date: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  offline?: boolean;
  message?: string;
}

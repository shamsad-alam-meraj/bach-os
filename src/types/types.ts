export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  messId?: string;
}

export interface Mess {
  _id: string;
  name: string;
  description?: string;
  address?: string;
  managerId: User;
  members: User[];
  mealRate: number;
  totalExpenses: number;
  totalMeals: number;
  totalDeposits: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  _id: string;
  userId: User;
  breakfast: number;
  lunch: number;
  dinner: number;
  date: string;
}

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  addedBy: User;
  date: string;
}

export interface DashboardData {
  mess: Mess;
  monthlyStats: {
    totalMembers: number;
    totalMeals: number;
    totalExpenses: number;
    totalDeposits: number;
    mealRate: number;
    expenseCount: number;
    mealEntries: number;
    depositCount: number;
  };
  memberStats: Array<{
    userId: string;
    userName: string;
    totalMeals: number;
    daysWithMeals: number;
    avgMealsPerDay: string;
  }>;
  expenseBreakdown: Array<{
    _id: string;
    totalAmount: number;
    count: number;
  }>;
  recentMeals: Meal[];
  recentExpenses: Expense[];
  calculationBreakdown: {
    totalExpenses: number;
    totalMeals: number;
    mealRate: number;
    formula: string;
    period: {
      start: string;
      end: string;
      month: string;
    };
  };
}

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

export interface MonthlyStats {
  totalMembers: number;
  totalMeals: number;
  totalExpenses: number;
  totalDeposits: number;
  mealRate: number;
  expenseCount: number;
  mealEntries: number;
  depositCount: number;
}

export interface MemberStats {
  userId: string;
  userName: string;
  totalMeals: number;
  daysWithMeals: number;
  avgMealsPerDay: string;
}

export interface ExpenseBreakdownItem {
  name: string;
  totalAmount: number;
  count: number;
}

export interface CalculationPeriod {
  start: string;
  end: string;
  month: string;
}

export interface CalculationBreakdown {
  totalExpenses: number;
  totalMeals: number;
  mealRate: number;
  formula: string;
  period: CalculationPeriod;
}

export interface DashboardData {
  mess: Mess;
  monthlyStats: MonthlyStats;
  memberStats: MemberStats[];
  expenseBreakdown: ExpenseBreakdownItem[];
  recentMeals: Meal[];
  recentExpenses: Expense[];
  calculationBreakdown: CalculationBreakdown;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface MealFormData {
  breakfast: number;
  lunch: number;
  dinner: number;
  date: string;
}

export interface ExpenseFormData {
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface MemberFormData {
  name: string;
  email: string;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    status?: number;
  };
  success: boolean;
  offline?: boolean;
}

// Component prop types
export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

export interface DashboardHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export interface DashboardSidebarProps {
  isOpen: boolean;
}

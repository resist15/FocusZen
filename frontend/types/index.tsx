export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
}

export interface DashboardSummaryDTO {
  totalTasks: number;
  completedTasks: number;
  totalGoals: number;
  breakCount: number;
  mindfulnessCount: number;
  weeklyRoutineCompletion: number;
}

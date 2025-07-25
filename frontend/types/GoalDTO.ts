export interface GoalDTO {
  id: number;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  completed: boolean;
}
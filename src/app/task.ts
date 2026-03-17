export interface Task {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
  status: 'todo' | 'in-progress' | 'completed';
}

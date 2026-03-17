import { Component, ViewChild } from '@angular/core';
import { Task } from '../task';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-home',
  imports: [Modal],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  tasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];
  selectedTask: Task | null = null;
  selectedIndex: number | null = null;
  @ViewChild(Modal) modal!: Modal;

  ngOnInit() {
    this.loadTasks();
  }

  updateStatus(task: Task, status: 'todo' | 'in-progress' | 'completed') {
    task.status = status;
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.loadTasks();
  }

  loadTasks() {
    const allTasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    this.tasks = allTasks;

    this.todoTasks = allTasks.filter((t) => t.status === 'todo');
    this.inProgressTasks = allTasks.filter((t) => t.status === 'in-progress');
    this.completedTasks = allTasks.filter((t) => t.status === 'completed');
  }

  editTask(task: Task) {
    const index = this.tasks.indexOf(task);
    this.selectedTask = task;
    this.selectedIndex = index;
    this.modal.setEditData(task, index);
    this.modal.openModal();
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter((t) => t !== task);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.loadTasks();
  }

  onTaskAdded() {
    this.loadTasks();
  }

  isDueSoon(date: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(date);
    due.setHours(0, 0, 0, 0);

    const diffDays = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 2;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';

    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return this.formatDate(date);
  }

  getDueStatus(date: string): 'overdue' | 'soon' | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(date);
    due.setHours(0, 0, 0, 0);

    const diffDays = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return 'overdue';
    if (diffDays <= 2) return 'soon';
    return null;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from './task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>(this.getTasks());
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  private editingTaskSubject = new BehaviorSubject<{ index: number; task: Task } | null>(null);
  public editingTask$ = this.editingTaskSubject.asObservable();

  constructor() {
    // Listen to storage changes from other tabs/windows
    window.addEventListener('storage', () => {
      this.tasksSubject.next(this.getTasks());
    });
  }

  getTasks(): Task[] {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  }

  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  updateTasks(tasks: Task[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  deleteTask(index: number): void {
    const tasks = this.getTasks();
    tasks.splice(index, 1);
    this.updateTasks(tasks);
  }

  updateTask(index: number, updatedTask: Task): void {
    const tasks = this.getTasks();
    tasks[index] = updatedTask;
    this.updateTasks(tasks);
  }

  setEditingTask(index: number, task: Task): void {
    this.editingTaskSubject.next({ index, task });
  }

  clearEditingTask(): void {
    this.editingTaskSubject.next(null);
  }
}

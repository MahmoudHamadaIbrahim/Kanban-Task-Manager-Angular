import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../task';
import { EventEmitter, Output, Input } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-modal',
  imports: [FormsModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  isEditMode: boolean = false;
  @Input() editIndex: number | null = null;
  @Input() editTaskData: Task | null = null;
  @Output() taskAdded = new EventEmitter<void>();

  currentTask: Task = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    createdAt: '',
    status: 'todo',
  };

  submitted: boolean = false;

  setEditData(task: Task, index: number) {
    this.isEditMode = true;
    this.editIndex = index;
    this.editTaskData = task;
    this.currentTask = { ...task };
  }

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  isPastDate(): boolean {
    if (!this.currentTask.dueDate) return false;
    return this.currentTask.dueDate < this.today;
  }

  saveTask() {
    this.submitted = true;
    if (this.currentTask.title.trim().length === 0) return;
    if (this.isPastDate()) return;

    const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');

    if (this.editIndex !== null) {
      //EDIT
      tasks[this.editIndex] = {
        ...tasks[this.editIndex],
        ...this.currentTask,
      };
    } else {
      //ADD
      tasks.push({
        ...this.currentTask,
        createdAt: new Date().toISOString(),
        status: 'todo',
      });
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));

    this.taskAdded.emit();
    this.resetForm();
    this.closeModal();
  }

  closeModal() {
    const modalEl = document.getElementById('taskModal');
    if (!modalEl) return;

    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }

  openModal() {
    const modalEl = document.getElementById('taskModal');
    if (!modalEl) return;

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  resetForm() {
    this.editIndex = null;
    this.editTaskData = null;
    this.currentTask = {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      createdAt: '',
      status: 'todo',
    };
    this.submitted = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { DepartmentPayload, DepartmentService } from 'src/app/services/department.service';

interface Department {
  id: number | string;
  name: string;
  code?: string | null;
  description?: string | null;
}

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departments: Department[] = [];

  showForm = false;
  isEdit = false;
  formModel: Partial<Department> = { name: '', code: '', description: '' };
  loading = false;

  constructor(private deptService: DepartmentService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.deptService.list().subscribe({
      next: (res) => {
        this.departments = (res || []).map(r => ({ id: (r as any).id, name: r.name, code: r.code, description: r.description }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.departments = [];
      }
    });
  }

  openCreate() {
    this.isEdit = false;
    this.formModel = { name: '', code: '', description: '' };
    this.showForm = true;
  }

  openEdit(dep: Department) {
    this.isEdit = true;
    this.formModel = { id: dep.id, name: dep.name, code: dep.code, description: dep.description };
    this.showForm = true;
  }

  save() {
    if (!this.formModel.name || this.formModel.name.trim() === '') return;
    this.loading = true;
    const payload: Partial<DepartmentPayload> = { name: (this.formModel.name || '').trim(), code: this.formModel.code || null, description: this.formModel.description || null };
    if (this.isEdit && this.formModel.id != null) {
      this.deptService.update(this.formModel.id as any, payload).subscribe({
        next: () => { this.load(); this.cancel(); },
        error: (err) => { this.loading = false; console.error('Update department error', err); alert('Failed to update department: ' + (err?.error?.message || err?.message || err?.statusText || 'Unknown error')); }
      });
    } else {
      this.deptService.create(payload).subscribe({
        next: () => { this.load(); this.cancel(); },
        error: (err) => { this.loading = false; console.error('Create department error', err); alert('Failed to create department: ' + (err?.error?.message || err?.message || err?.statusText || 'Unknown error')); }
      });
    }
  }

  delete(id?: number | string) {
    if (id == null) return;
    if (!confirm('Delete this department?')) return;
    this.loading = true;
    this.deptService.delete(id).subscribe({
      next: () => { this.load(); },
      error: () => { this.loading = false; alert('Failed to delete department'); }
    });
  }

  cancel() {
    this.showForm = false;
    this.isEdit = false;
    this.formModel = { name: '', code: '', description: '' };
    this.loading = false;
  }

  trackById(index: number, item: Department) {
    return item.id;
  }

}

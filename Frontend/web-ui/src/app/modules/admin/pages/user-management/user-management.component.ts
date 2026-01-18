import { Component, OnInit } from '@angular/core';
import { Assignment, AssignmentService } from '../../../../services/assignment.service';
import { AttendanceRecord, AttendanceService } from '../../../../services/attendance.service';
import { Course, CourseService } from '../../../../services/course.service';
import { User, UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  
  courses: Course[] = [];
  departments: string[] = [];

  showForm = false;
  editing = false;
  currentAddRole: 'Admin' | 'Student' | 'Faculty' = 'Admin';
  tempUser: Partial<User> = {};
  searchTerm = '';
  roleFilter = 'Admin';
  loading = false;
  errorMessage = '';

  // For viewing faculty data
  showAttendanceModal = false;
  showAssignmentsModal = false;
  selectedFacultyAttendance: AttendanceRecord[] = [];
  selectedFacultyAssignments: Assignment[] = [];
  selectedFacultyName = '';
  loadingFacultyData = false;

  constructor(
    private courseService: CourseService, 
    private userService: UserService,
    private assignmentService: AssignmentService,
    private attendanceService: AttendanceService
  ) { }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
    
    this.courseService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments.map(d => d.name);
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
    
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.userService.list().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load users', err);
        this.errorMessage = 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  get filteredUsers(): User[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.users.filter(u => {
      const matchesTerm = !term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
      const matchesRole = !this.roleFilter || u.roles.includes(this.roleFilter);
      return matchesTerm && matchesRole;
    });
  }

  getSubjectsDisplay(subjects?: string): string {
    if (!subjects) return '-';
    const course = this.courses.find(c => c.course_name === subjects);
    return course ? course.course_name : subjects;
  }

  get modalTitle(): string {
    if (this.editing) {
      const role = (this.tempUser.roles && this.tempUser.roles.length) ? this.tempUser.roles[0] : 'User';
      return `Edit ${role}`;
    }
    return `Add ${this.currentAddRole || this.roleFilter}`;
  }

  setRoleFilter(role: string): void {
    this.roleFilter = role;
  }

  openAddForRole(role: 'Admin' | 'Student' | 'Faculty'): void {
    this.editing = false;
    this.currentAddRole = role;
    this.tempUser = { name: '', email: '', roles: [role], status: 'Active' };
    if (role === 'Student') this.tempUser.semester = 1;
    if (role === 'Faculty') this.tempUser.subjects = undefined;
    this.showForm = true;
  }

  openAddCurrent(): void {
    this.openAddForRole(this.roleFilter as 'Admin' | 'Student' | 'Faculty');
  }

  countByRole(role: string): number {
    return this.users.filter(u => u.roles.includes(role)).length;
  }

  

  openEdit(user: User): void {
    this.editing = true;
    this.tempUser = { ...user };
    this.currentAddRole = (user.roles && user.roles.length) ? (user.roles[0] as 'Admin' | 'Student' | 'Faculty') : 'Admin';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.tempUser = {};
  }

  saveUser(): void {
    const t = this.tempUser as User;

    if (!t.name || !t.email) {
      alert('Please provide name and email.');
      return;
    }
    if (!this.isValidName(t.name)) {
      alert('Name must contain only alphabetic.');
      return;
    }
    if (!this.isValidEmail(t.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!this.editing && !t.password) {
      alert('Please provide a password.');
      return;
    }

    const role = this.editing ? (t.roles && t.roles.length ? t.roles[0] : this.currentAddRole) : (this.currentAddRole || this.roleFilter);
    if (role === 'Student') {
      if ((t as any).semester === undefined || (t as any).semester === null) {
        alert('Please select a semester for the student.');
        return;
      }
    }
    if (role === 'Faculty') {
      if (!t.subjects) {
        alert('Please select a subject for the faculty.');
        return;
      }
      if (!t.department) {
        alert('Please select a department for the faculty.');
        return;
      }
    }

    this.loading = true;

    if (this.editing && t.id !== undefined) {
      const payload: Partial<User> & { roles: string[] } = {
        ...t,
        roles: this.tempUser.roles || [this.currentAddRole]
      };

      if (t.department) payload.department = t.department;

      this.userService.update(t.id, payload).subscribe({
          next: () => {
          if (role === 'Faculty' && t.subjects && t.id) {
            this.assignCourseToFaculty(t.id, t.subjects);
          } else if (role === 'Student' && (t as any).semester && t.id) {
            this.assignCoursesToStudent(t.id, (t as any).semester);
          } else {
            this.loading = false;
            this.closeForm();
            this.loadUsers();
          }
        },
          error: (err: any) => {
            console.error('Failed to update user', err);
            alert('Failed to update user.');
            this.loading = false;
          }
      });
    } else {
      const payload: Partial<User> & { roles: string[] } = {
        ...t,
        roles: [role],
        status: t.status || 'Active',
        semester: role === 'Student' ? ((t as any).semester || 1) : undefined,
        department: t.department || undefined
      };

      this.userService.create(payload).subscribe({
          next: (createdUser: User) => {
          if (role === 'Faculty' && t.subjects && createdUser.id) {
            this.assignCourseToFaculty(createdUser.id, t.subjects);
          } else if (role === 'Student' && (t as any).semester && createdUser.id) {
            this.assignCoursesToStudent(createdUser.id, (t as any).semester);
          } else {
            this.loading = false;
            this.closeForm();
            this.loadUsers();
          }
        },
          error: (err: any) => {
            console.error('Failed to create user', err);
            alert('Failed to create user.');
            this.loading = false;
          }
      });
    }
  }

  private isValidEmail(email: string | undefined): boolean {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  private isValidName(name: string | undefined): boolean {
    if (!name) return false;
    const re = /^[A-Za-z ]+$/;
    return re.test(name.trim());
  }

  private assignCourseToFaculty(facultyId: string | number, courseName: string): void {
    const course = this.courses.find(c => c.course_name === courseName);
    if (!course) {
      console.error('Course not found:', courseName);
      this.loading = false;
      this.closeForm();
      this.loadUsers();
      return;
    }

    this.courseService.assignCourseToFaculty(facultyId, course.id).subscribe({
      next: (response) => {
        console.log('Course assigned successfully:', response);
        this.loading = false;
        this.closeForm();
        this.loadUsers();
      },
      error: (err: any) => {
        console.error('Failed to assign course to faculty', err);
        alert('User saved but failed to assign course.');
        this.loading = false;
        this.closeForm();
        this.loadUsers();
      }
    });
  }

  private assignCoursesToStudent(studentId: string | number, semester: number): void {
    this.courseService.assignCoursesToStudent(studentId, semester).subscribe({
      next: (response) => {
        console.log('Courses assigned successfully:', response);
        this.loading = false;
        this.closeForm();
        this.loadUsers();
      },
      error: (err: any) => {
        console.error('Failed to assign courses to student', err);
        alert('User saved but failed to assign courses.');
        this.loading = false;
        this.closeForm();
        this.loadUsers();
      }
    });
  }

  deleteUser(id?: number | string): void {
    if (!id) return;
    if (!confirm('Delete this user?')) return;
    this.loading = true;
    this.userService.delete(id).subscribe({
      next: () => {
        this.loading = false;
        this.loadUsers();
      },
      error: (err: any) => {
        console.error('Failed to delete user', err);
        alert('Failed to delete user.');
        this.loading = false;
      }
    });
  }

  toggleRole(role: string): void {
    const t = this.tempUser as User;
    if (!t.roles) t.roles = [];
    const i = t.roles.indexOf(role);
    if (i === -1) t.roles.push(role);
    else t.roles.splice(i, 1);
  }

  viewAttendance(faculty: User): void {
    this.selectedFacultyName = faculty.name;
    this.loadingFacultyData = true;
    this.showAttendanceModal = true;
    this.selectedFacultyAttendance = [];

    this.attendanceService.getAttendance(faculty.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.selectedFacultyAttendance = Array.isArray(response.data) ? response.data : [];
        }
        this.loadingFacultyData = false;
      },
      error: (error: any) => {
        console.error('Error loading attendance:', error);
        this.loadingFacultyData = false;
      }
    });
  }

  viewAssignments(faculty: User): void {
    this.selectedFacultyName = faculty.name;
    this.loadingFacultyData = true;
    this.showAssignmentsModal = true;
    this.selectedFacultyAssignments = [];

    // Note: This requires the backend to support fetching assignments by faculty ID
    // For now, we'll use a workaround by filtering all assignments
    this.assignmentService.getFacultyAssignments().subscribe({
      next: (response) => {
        if (response.success) {
          const assignments = Array.isArray(response.data) ? response.data : [response.data];
          // Filter by faculty ID if needed
          this.selectedFacultyAssignments = assignments.filter((a: Assignment) => a.faculty_id === faculty.id);
        }
        this.loadingFacultyData = false;
      },
      error: (error) => {
        console.error('Error loading assignments:', error);
        this.loadingFacultyData = false;
      }
    });
  }

  closeAttendanceModal(): void {
    this.showAttendanceModal = false;
    this.selectedFacultyAttendance = [];
    this.selectedFacultyName = '';
  }

  closeAssignmentsModal(): void {
    this.showAssignmentsModal = false;
    this.selectedFacultyAssignments = [];
    this.selectedFacultyName = '';
  }
}

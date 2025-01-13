import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { UserService } from '../../../services/securityAdministration/user/user.service';
import { CommonModule } from '@angular/common';
import { HidePasswordPipe } from '../../../shared/pipes/passwordPipe.pipe';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { RoleService } from '../../../services/securityAdministration/role/role.service';
import { TenantService } from '../../../services/securityAdministration/tenant/tenant.service';
import { UserDTO } from '../../../core/securityAdministration/user/userDTO.model';
import { RoleDTO } from '../../../core/securityAdministration/role/roleDTO.model';
import { CustomResponse } from '../../../core/common/response';
import { TenantDTO } from '../../../core/securityAdministration/Tenant/tenantDTO.model'; 
import Swal from 'sweetalert2'
import { FilterPipe } from '../../../shared/pipes/filter.pipe';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,HidePasswordPipe,ReactiveFormsModule,NgSelectModule,NgbPagination,FormsModule,FilterPipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{

    private userService = inject(UserService);
    private modalService = inject(NgbModal)
    private roleService = inject(RoleService);
    private tenantService = inject(TenantService)
    private fb = inject(FormBuilder);

    users:UserDTO[] = [];
    roles : RoleDTO[] = [];
    tenants : TenantDTO[] = [];
    userForm!:FormGroup;
    submitted : boolean = false;
    isEdit = false;
    showPassword: boolean[] = [];
    pagedUsers:UserDTO[] = []; // Stores the users for the current page
    currentPage = 1; // Current page number
    pageSize = 18; // Number of rows per page
    searchText:string = '';
    

    
    ngOnInit(): void {

      this.getAllroles();
      this.getAllUsers();
      this.getAllTenants();
      this.userForm = this.createUserForm(this.isEdit);
    }

    updatePagedUsers(): void {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.pagedUsers = this.users.slice(startIndex, endIndex);
    }

    onPageChange(page: number) {
      this.currentPage = page;
      this.updatePagedUsers();
    }

  

    createUserForm(isEdit: boolean): FormGroup {
      return this.fb.group(
        {
          id : [''],
          username: ['', [Validators.required]],
          roleId: ['', [Validators.required]],
          password: ['', [Validators.required]],
          confirmPassword: ['', [Validators.required]],
          tenantId: ['', [Validators.required]],
        },
        {
          validator: isEdit ? null : this.passwordsMatch('password', 'confirmPassword'),
        }
      );
    }

  
    togglePasswordVisibility(index: number): void {
      this.showPassword[index] = !this.showPassword[index];
    }

    getAllUsers(){
      this.userService.getAllUsers().subscribe({
        next: (res:CustomResponse) => {
          this.users = res.data;
          this.updatePagedUsers();
          console.log(this.users);
        }

      })
    }

    getFormData() {
      return {
        id : this.userForm.get('id')?.value,
        username: this.userForm.get('username')?.value,
        roleId: this.userForm.get('roleId')?.value,
        password: this.userForm.get('password')?.value,
        tenantId: this.userForm.get('tenantId')?.value
      };
    }

    SaveUser() {
      this.submitted = true;
      console.log(this.userForm.value);
      if (this.userForm.invalid && !this.isEdit) {
        this.displayValidationErrors();
        return;
      }
    
      this.showToast = false;
      const formData = this.getFormData();
      if(!this.isEdit){
        this.confirmAdd(formData);
      }
      else{
        this.confirmUpdate(formData);
      }
      console.log('Form submitted successfully', formData);
    }


    confirmAdd(formData: any) {
      this.userService.addUser(formData).subscribe({
        next: (res: CustomResponse) => {
          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: 'User added successfully!',
              text: res.message || 'User has been added.',
            }).then(() => {
              this.getAllUsers();
              this.closeModal();
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong. Please try again.',
            });
          }
        },
        error: (res: CustomResponse) => {
          console.warn(res.message);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: res.message || 'An error occurred. Please try again.',
          });
        },
      });
    }

    get form() {
      return this.userForm.controls;
    }

    openModal(content: TemplateRef<any>) {
      console.log(content); // Check if content is defined
      this.modalService.open(content, {
        size: 'xl',
        backdrop: 'static', // Prevent clicking outside to close
        keyboard: true     // Disable Esc key closing
      });
    }

    closeModal() {
      this.modalService.dismissAll();
    }

    getAllroles(){
      this.roleService.getAllRoles().subscribe({
        next: (res:CustomResponse) => {
          this.roles = res.data;
          console.log(res.data);
        }
      })
    }
    getAllTenants(){
      this.tenantService.getAllTenants().subscribe({
        next: (res:CustomResponse) => {
          this.tenants = res.data;
          console.log(res.data);
        }
      })
    }


    // Custom validator to check if passwords match
    passwordsMatch(password: string, confirmPassword: string) {
      return (formGroup: FormGroup) => {
        const passwordControl = formGroup.get(password);
        const confirmPasswordControl = formGroup.get(confirmPassword);

        // Ensure both password and confirmPassword controls exist
        if (!passwordControl || !confirmPasswordControl) {
          return;
        }

        // If passwords don't match, set the error on confirmPassword
        if (passwordControl.value !== confirmPasswordControl.value) {
          confirmPasswordControl.setErrors({ passwordMismatch: true });
        } else {
          confirmPasswordControl.setErrors(null);  // Clear any previous error
        }
      };
    }

    showToast = false;
    toastErrors: string[] = [];

    displayValidationErrors() {
      this.toastErrors = [];

      if (this.form['username']?.errors?.['required']) {
        this.toastErrors.push('UserName is required.');
      }
      if (this.form['password']?.errors?.['required'] && !this.isEdit) {
        this.toastErrors.push('password is required.');
      }
      if (this.form['confirmPassword'].errors?.['passwordMismatch'] && !this.isEdit) {
        this.toastErrors.push('Passwords do not match.');
      }
      if (this.form['roleId']?.errors?.['required']) {
        this.toastErrors.push('Role name is required.');
      }
      if (this.form['tenantId']?.errors?.['required']) {
        this.toastErrors.push('Tenant is required.');
      }


      this.showToast = true;

    }


    hideToast() {
      this.showToast = false;
    }



    confirmDelete(id : any) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, delete it!'
      }).then(result => {
        if (result.isConfirmed) {
          this.userService.deleteUser(id).subscribe({
            next : (res:CustomResponse) =>{
              if(res.success){
                Swal.fire('Deleted!', 'User has been deleted.', 'success');
                this.getAllUsers();
              }
              else{
                Swal.fire('Oops!', 'User cannot be updated.', 'error');
              }
            },
            error : (e:any) => console.warn(e)
          })
        }
      });
    }


    editUser(id:number,content:TemplateRef<any>){
      this.isEdit = true;
      this.createUserForm(this.isEdit);
      this.userService.getUserById(id).subscribe({
        next : (res:CustomResponse) =>{
          if(res.success){
            const user = res.data;
            this.userForm.patchValue({
              id: user.id,
              tenantId:user.tenantId,
              username:user.username,
              password:user.password,
              roleId:user.roleId
            });
            this.openModal(content)
          }
          else{
            Swal.fire('Error!', 'Failed to fetch menu data.', 'error');
          }
        },
        error: e => Swal.fire('Error!', 'An unexpected error occurred.', 'error')
      })
    }

    updateUser(model:any){
      this.userService.updateUser(model).subscribe({
        next: (res:CustomResponse) => {
          if(res.success){
            this.modalService.dismissAll();
            Swal.fire('Updated!', 'User has been updated.', 'success')
            this.getAllUsers();
          }
          else{
            Swal.fire('Oops!', 'User cannot be updated.', 'error');
          }
        },
        error : e => console.warn(e)
      })
    }

    confirmUpdate(data : any){
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, update it!'
      }).then(result => {
        if (result.isConfirmed) {
            this.updateUser(data);
          }
      });
    }

    

}

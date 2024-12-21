import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { UserService } from '../../../services/SecurityAdministration/user/user.service';
import { CommonModule } from '@angular/common';
import { HidePasswordPipe } from '../../../services/common/passwordPipe.pipe';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService } from '../../../services/SecurityAdministration/role/role.service';
import { TenantService } from '../../../services/SecurityAdministration/tenant/tenant.service';
import { UserDTO } from '../../../core/SecurityAdministration/user/userDTO.model';
import { RoleDTO } from '../../../core/SecurityAdministration/role/roleDTO.model';
import { CustomResponse } from '../../../core/common/response';
import { TenantDTO } from '../../../core/SecurityAdministration/Tenant/tenantDTO.model'; 
import Swal from 'sweetalert2'

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,HidePasswordPipe,ReactiveFormsModule,NgSelectModule],
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
 
    
    ngOnInit(): void {

      this.getAllroles();
      this.getAllUsers();
      this.getAllTenants();
      this.userForm = this.fb.group({
        username: ['', [Validators.required]],
        roleId: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        tenantId: ['', [Validators.required]]
      }, {
        validator: this.passwordsMatch('password', 'confirmPassword')
      });
      


    }
    showPassword: boolean[] = [];

    togglePasswordVisibility(index: number): void {
      this.showPassword[index] = !this.showPassword[index];
    }

    getAllUsers(){
      this.userService.getAllUsers().subscribe({
        next: (res:CustomResponse) => {
          this.users = res.data;
          console.log(this.users);
        }

      })
    }

    getFormData() {
      return {
        username: this.userForm.get('username')?.value,
        roleId: this.userForm.get('roleId')?.value,
        password: this.userForm.get('password')?.value,
        tenantId: this.userForm.get('tenantId')?.value
      };
    }

    SaveUser(){
      this.submitted = true;
      if (this.userForm.invalid) {
        this.displayValidationErrors();
        return;
      }
  
      this.showToast = false;
      const formData = this.getFormData();
      this.userService.addUser(formData).subscribe({
        next: (res:CustomResponse) => {
          if(res.success){
            Swal.fire({
              icon:'success',
              title:'User added successfully!',
              text:res.message || 'User has been added.',
            }).then(()=>{
              this.getAllUsers();
              this.closeModal();
            })
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong. Please try again.',
            });
          }
        },
        error: (res:CustomResponse) => {
          console.warn(res.message);
      // Show error SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: res.message || 'An error occurred. Please try again.',
      });
        }
      })
      console.log('Form submitted successfully', formData);
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
      if (this.form['password']?.errors?.['required']) {
        this.toastErrors.push('password is required.');
      }
      if (this.form['confirmPassword'].errors?.['passwordMismatch']) {
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
            },
            error : (e:any) => console.warn(e)
          })
        }
      });
    }

    

}

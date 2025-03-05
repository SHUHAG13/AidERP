import { Component, inject, OnInit } from '@angular/core';
import { RoleService } from '../../../services/SecurityAdministration/role/role.service';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { RoleDTO } from '../../../core/SecurityAdministration/role/roleDTO.model';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../../services/common/sweetalert.service';
import Swal from 'sweetalert2';
import { CustomResponse } from '../../../core/common/response';
import { ErrorToastComponent } from '../../../shared/components/error-toast/error-toast.component';
import { Dialog } from 'primeng/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { TenantService } from '../../../services/SecurityAdministration/tenant/tenant.service';
import { TenantDTO } from '../../../core/SecurityAdministration/Tenant/tenantDTO.model';
import { PageTitleComponent } from '../../../shared/components/pagetitle/page-title.component';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    ErrorToastComponent,
    Dialog,
    NgSelectModule,
    PageTitleComponent
  ],
  templateUrl: './role.component.html'
})
export class RoleComponent implements OnInit{
  breadCrumbItems!: Array<{}>;
  roles : RoleDTO[] = [];
  tenants: TenantDTO[] = [];
  totalRecords : number = 0;
  formData!: FormGroup;
  submitted : boolean = false;
  isEdit : boolean = false;
  isDialogVisible: boolean = false;

  private formBuilder = inject(FormBuilder);
  private modalService = inject(NgbModal);
  private sweetAlertService = inject(SweetalertService);
  private tenantService = inject(TenantService)
  constructor(private roleService : RoleService){}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Security Administration' }, { label: 'Role', active: true }];
    this.loadRoles();
    this.loadTenants();
    this.resetForm();
  }

  clear(table: Table) {
    table.clear();
  }

  loadRoles(){
    this.roleService.getAllRoles().subscribe({
      next : res => this.roles = res.data,
      error : err => console.error(err)
    })
  }

  loadTenants(){
    this.tenantService.getAllTenants().subscribe({
      next : res => this.tenants = res.data,
      error : e => console.warn(e)
    })
  }


  showDialog() {
    this.resetForm();
    this.isEdit = false;
    this.isDialogVisible = true;
  }

  resetForm(){
    this.formData = this.formBuilder.group({
      id: [''],
      tenantId: [''],
      roleName: ['',[Validators.required]],
      roleRank: ['',[Validators.required]],
      description: ['']
    })
  }

  get form() {
    return this.formData.controls;
  }

  // save
  saveRole(){
    this.submitted = true;
      
      if (this.formData.invalid) {
        this.displayValidationErrors();
        return;
      }

      // If valid, handle successful form submission
      this.showToast = false;
      this.isDialogVisible = false;

      const model = {
        Id: this.formData.value.id,
        TenantId: this.formData.value.tenantId,
        RoleName: this.formData.value.roleName,
        RoleRank: this.formData.value.roleRank,
        Description: this.formData.value.description
      }
      if(this.isEdit){
        this.confirmUpdate(model);
      }else{
        this.confirmAdd(model);
      }
  }

  // for error toaster
  showToast = false; // Tracks toast visibility
  toastErrors: string[] = [];

  displayValidationErrors() {
    
    this.toastErrors = [];

    if (this.form['roleName'].errors?.['required']) {
      this.toastErrors.push('Role Name is required.');
    }
    if (this.form['roleRank'].errors?.['required']) {
      this.toastErrors.push('Role Rank is required.');
    }

    this.showToast = true;

  // Auto-hide toast after a delay
    // setTimeout(() => {
    //   this.showToast = false;
    // }, 8000);
  }

  // sweet alert
  confirmAdd(data : any){
    this.sweetAlertService.confirmation('add')
      .then((confirmed)=>{
        if(confirmed){
          this.addRole(data);
        }
      })
  }

  addRole(model : any){
    this.roleService.addRole(model).subscribe({
      next : (res : CustomResponse) => {
        console.log(res)
        if (res.success) {
          this.modalService.dismissAll(); // Close the modal
          Swal.fire('Added!', 'Your role has been added.', 'success')
          this.ngOnInit(); // Refresh the role list
        } else {
          console.warn('Role addition failed:', res.message);
          Swal.fire(res.message, res.data, 'warning')
        }
      },
      error : e => {
        console.warn(e)
        Swal.fire(e.error.message, e.error.data, 'warning')
      }
    })
  }

  // edit role
  editRole(id: any) {
    this.isEdit = true;
    this.roleService.getRoleById(id).subscribe({
      next: (res: CustomResponse) => {
        console.log(res.data)
        if (res.success) {
          const role = res.data;
  
          // Patch the form with the fetched data
          this.formData.patchValue({
            id: role.id,
            tenantId: role.tenantId,
            roleName: role.roleName,
            roleRank: role.roleRank,
            description: role.description
          });
  
          // Open the dialog after data is patched
          this.isDialogVisible = true;
        } else {
          console.warn('Failed to fetch role data:', res.message);
          Swal.fire(res.message, res.data, 'warning');
        }
      },
      error: (e) => {
        console.warn(e);
        Swal.fire(e.error.message, e.error.data, 'warning');
      }
    });
  }

  confirmUpdate(data : any){
    this.sweetAlertService.confirmation('update')
      .then((confirmed)=>{
        if(confirmed){
          this.updateRole(data);
        }
      })
  }

  updateRole(model : any){
    this.roleService.updateRole(model).subscribe({
      next : (res : CustomResponse) => {
        console.log(res)
        if (res.success) {
          this.modalService.dismissAll(); // Close the modal
          Swal.fire('Updated!', 'Your role has been updated.', 'success')
          this.ngOnInit(); // Refresh the role list
        } else {
          console.warn('Role updating failed:', res.message);
          Swal.fire(res.message, res.data, 'warning');
        }
      },
      error : e => {
        console.warn(e);
        Swal.fire(e.error.message, e.error.data, 'warning');
      }
    })
  }

  confirmDelete(id : any) {
    this.sweetAlertService.confirmation('delete')
      .then((confirmed)=>{
        if(confirmed){
          this.roleService.deleteRole(id).subscribe({
            next : (res:CustomResponse) =>{
              if(res.success){
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                this.ngOnInit(); // Refresh the role list
              }
            },
            error : e => {
              console.warn(e)
              Swal.fire(e.error.message, e.error.data, 'warning');
            }
          })
        }
      })
  }
}

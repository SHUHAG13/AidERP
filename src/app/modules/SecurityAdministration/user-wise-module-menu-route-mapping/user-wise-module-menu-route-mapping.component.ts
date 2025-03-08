import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ErrorToastComponent } from '../../../shared/components/error-toast/error-toast.component';
import { Dialog } from 'primeng/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { PageTitleComponent } from '../../../shared/components/pagetitle/page-title.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../../services/common/sweetalert.service';
import { UserWiseModuleMenuRouteMappingService } from '../../../services/SecurityAdministration/userWiseModuleMenuRouteMapping/user-wise-module-menu-route-mapping.service';
import { CustomResponse } from '../../../core/common/response';
import Swal from 'sweetalert2';
import { UserDTO } from '../../../core/SecurityAdministration/user/userDTO.model';
import { ModuleDTO } from '../../../core/SecurityAdministration/module/module.model';
import { MenuDTO } from '../../../core/SecurityAdministration/menu/user-module-menu-dto';
import { UserService } from '../../../services/SecurityAdministration/user/user.service';
import { ModuleService } from '../../../services/SecurityAdministration/module/module.service';
import { MenuService } from '../../../services/SecurityAdministration/menu/menu.service';
import { UserWiseModuleMenuRouteMappingDTO } from '../../../core/SecurityAdministration/userWiseModuleMenuRouteMapping/userWiseModuleMenuRouteMappingDTO';

@Component({
  selector: 'app-user-wise-module-menu-route-mapping',
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
  templateUrl: './user-wise-module-menu-route-mapping.component.html'
})
export class UserWiseModuleMenuRouteMappingComponent implements OnInit{
  breadCrumbItems!: Array<{}>;
  userWiseModuleMenuRoutes: UserWiseModuleMenuRouteMappingDTO[] = [];
  users: UserDTO[] = [];
  modules: ModuleDTO[] = [];
  menus: MenuDTO[] = [];
  totalRecords : number = 0;
  formData!: FormGroup;
  submitted : boolean = false;
  isEdit : boolean = false;
  isDialogVisible: boolean = false;

  private formBuilder = inject(FormBuilder);
  private modalService = inject(NgbModal);
  private sweetAlertService = inject(SweetalertService)
  private userService = inject(UserService)
  private moduleService = inject(ModuleService)
  private menuService = inject(MenuService)
  private userWiseModuleMenuRouteMappingService = inject(UserWiseModuleMenuRouteMappingService)
  constructor(){}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Security Administration' }, { label: 'User Wise Module Menu Route Mapping', active: true }];
    
    this.loadUserWiseModuleMenuRoutes();
    this.loadUsers();
    //this.loadRoutes();
    this.loadModules();
    this.loadMenus();
    this.resetForm();
  }

  clear(table: Table) {
    table.clear();
  }

  loadUserWiseModuleMenuRoutes(){
    this.userWiseModuleMenuRouteMappingService.getAll().subscribe({
      next : res => this.userWiseModuleMenuRoutes = res.data,
      error : err => console.error(err)
    })
  }

  loadUsers(){
    this.userService.getAllUsers().subscribe({
      next : res => this.users = res.data,
      error : err => console.error(err)
    })
  }

  loadModules(){
    this.moduleService.getAllModules().subscribe({
      next : res => this.modules = res.data,
      error : e => console.warn(e)
    })
  }

  loadMenus(){
    this.menuService.getAllMenus().subscribe({
      next : res => this.menus = res.data,
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
      userId: ['',[Validators.required]],
      moduleId: ['',[Validators.required]],
      moduleName: ['',[Validators.required]],
      moduleSlNo: ['',[Validators.required]],
      menuId: ['',[Validators.required]],
      menuName: ['',[Validators.required]],
      menuSlNo: ['',[Validators.required]],
      routeId: ['',[Validators.required]],
    })
  }

  get form() {
    return this.formData.controls;
  }

  // save
  saveUserWiseModuleMenuRouteMapping(){
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
        UserId: this.formData.value.userId,
        RoleId: this.formData.value.roleId,
        ModuleId: this.formData.value.moduleId,
        ModuleName: this.formData.value.moduleName,
        ModuleSLNo: this.formData.value.moduleSlNo,
        MenuId: this.formData.value.menuId,
        MenuName: this.formData.value.menuName,
        MenuSLNo: this.formData.value.menuSlNo,
        RouteId: this.formData.value.routeId
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

    if (this.form['userId'].errors?.['required']) {
      this.toastErrors.push('UserId is required.');
    }
    if (this.form['moduleId'].errors?.['required']) {
      this.toastErrors.push('ModuleId is required.');
    }
    if (this.form['moduleName'].errors?.['required']) {
      this.toastErrors.push('ModuleName is required.');
    }
    if (this.form['moduleSlNo'].errors?.['required']) {
      this.toastErrors.push('ModuleSLNo is required.');
    }
    if (this.form['menuId'].errors?.['required']) {
      this.toastErrors.push('MenuId is required.');
    }
    if (this.form['menuName'].errors?.['required']) {
      this.toastErrors.push('MenuName is required.');
    }
    if (this.form['menuSlNo'].errors?.['required']) {
      this.toastErrors.push('MenuSLNo is required.');
    }
    if (this.form['routeId'].errors?.['required']) {
      this.toastErrors.push('RouteId is required.');
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
          this.addUserWiseModuleMenuRouteMapping(data);
        }
      })
  }

  addUserWiseModuleMenuRouteMapping(model : any){
    this.userWiseModuleMenuRouteMappingService.add(model).subscribe({
      next : (res : CustomResponse) => {
        console.log(res)
        if (res.success) {
          this.modalService.dismissAll(); // Close the modal
          Swal.fire('Added!', 'Your UserWiseModuleMenuRouteMapping has been added.', 'success')
          this.ngOnInit(); // Refresh the UserWiseModuleMenuRouteMapping list
        } else {
          console.warn('UserWiseModuleMenuRouteMapping addition failed:', res.message);
          Swal.fire(res.message, res.data, 'warning')
        }
      },
      error : e => {
        console.warn(e)
        Swal.fire(e.error.message, e.error.data, 'warning')
      }
    })
  }

  // edit UserWiseModuleMenuRouteMapping
  editUserWiseModuleMenuRouteMapping(id: any) {
    this.isEdit = true;
    this.userWiseModuleMenuRouteMappingService.getById(id).subscribe({
      next: (res: CustomResponse) => {
        if (res.success) {
          const model = res.data;
          // Patch the form with the fetched data
          this.formData.patchValue({
            id: model.id,
            userId: model.userId,
            roleId: model.roleId,
            moduleId: model.moduleId,
            moduleName: model.moduleName,
            moduleSlNo: model.moduleSLNo,
            menuId: model.menuId,
            menuName: model.menuName,
            menuSlNo: model.menuSLNo,
            routeId: model.routeId
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
          this.updateUserWiseModuleMenuRouteMapping(data);
        }
      })
  }

  updateUserWiseModuleMenuRouteMapping(model : any){
    this.userWiseModuleMenuRouteMappingService.update(model).subscribe({
      next : (res : CustomResponse) => {
        if (res.success) {
          this.modalService.dismissAll(); // Close the modal
          Swal.fire('Updated!', 'Your UserWiseModuleMenuRouteMapping has been updated.', 'success')
          this.ngOnInit(); // Refresh the UserWiseModuleMenuRouteMapping list
        } else {
          console.warn('UserWiseModuleMenuRouteMapping updating failed:', res.message);
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
          this.userWiseModuleMenuRouteMappingService.delete(id).subscribe({
            next : (res:CustomResponse) =>{
              if(res.success){
                Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
                this.ngOnInit(); // Refresh the UserWiseModuleMenuRouteMapping list
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

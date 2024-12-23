import { Component, inject, NO_ERRORS_SCHEMA, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MenuListDTO } from '../../../../core/SecurityAdministration/menu/menu.model';
import { MenuService } from '../../../../services/SecurityAdministration/menu/menu.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModuleService } from '../../../../services/SecurityAdministration/module/module.service';
import { ModuleDTO } from '../../../../core/SecurityAdministration/module/module.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomResponse } from '../../../../core/common/response';
import Swal from 'sweetalert2';
import { FilterPipe } from '../../../../services/common/pipes/filter.pipe';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgSelectModule,FormsModule,FilterPipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{

  menuList: MenuListDTO[] = []
  moduleList: ModuleDTO[] = []
  formData!: FormGroup;
  submitted = false;
  isEdit = false;
  searchText: string = "";

  private menuService = inject(MenuService);
  private moduleService = inject(ModuleService);
  private formBuilder = inject(FormBuilder);
  private modalService = inject(NgbModal)

  ngOnInit(): void {

    this.isEdit = false;
    this.getAllMenus();
    this.getAllModule();

    this.formData = this.formBuilder.group({
      id: [''],
      moduleId: ['',[Validators.required]],
      menuName: ['',[Validators.required]],
      shortName: [''],
      description: [''],
      url: ['',[Validators.required]],
      iconUrl: [''],
      parentMenuId: [''],
      order: ['',[Validators.required]]
    })
  }

  getAllMenus(){
    this.menuService.getAllMenus().subscribe({
      next : (res : any) =>{
        this.menuList = res.data;
        console.log(this.menuList);
      },
      error : e => console.log(e)
    })
  }

  getAllModule(){
    this.moduleService.getAllModules().subscribe({
      next: (res : any) => {
        console.log(res)
        this.moduleList = res.data;
      },
      error : e => console.log(e)
    })
  }

    /**
   * Open modal
    // param content modal content
   */
    openModal(content: TemplateRef<any>) {
      this.modalService.open(content,{
        size:'xl',
        backdrop: 'static',  // Prevent closing the modal by clicking outside
        keyboard: false,  // Prevent closing the modal with the Esc key
      });
    }
    get form() {
      return this.formData.controls;
    }
    saveMenu(){
      this.submitted = true;
      
      if (this.formData.invalid) {
        this.displayValidationErrors();
        return;
      }

      // If valid, handle successful form submission
      this.showToast = false;

      const model = {
        Id: this.formData.value.id,
        ModuleID: this.formData.value.moduleId,
        Name: this.formData.value.menuName,
        Description: this.formData.value.description,
        URL: this.formData.value.url,
        ParentMenuId: this.formData.value.parentMenuId,
        SLNo: this.formData.value.order,
        ShortName : this.formData.value.shortName,
        IconURL: this.formData.value.iconUrl
      }
      console.log(this.isEdit)
      if(this.isEdit){
        this.confirmUpdate(model);
      }else{
        this.confirmAdd(model);
      }
    }

    addMenu(model : any){
      this.menuService.addMenu(model).subscribe({
        next : (res : CustomResponse) => {
          console.log(res)
          if (res.success) {
            this.modalService.dismissAll(); // Close the modal
            Swal.fire('Added!', 'Your menu has been added.', 'success')
            this.ngOnInit(); // Refresh the menu list
          } else {
            console.warn('Menu addition failed:', res.message);
          }
        },
        error : e => console.warn(e)
      })
    }

    updateMenu(model : any){
      this.menuService.updateMenu(model).subscribe({
        next : (res : CustomResponse) => {
          console.log(res)
          if (res.success) {
            this.modalService.dismissAll(); // Close the modal
            Swal.fire('Updated!', 'Your menu has been updated.', 'success')
            this.ngOnInit(); // Refresh the menu list
          } else {
            console.warn('Menu updating failed:', res.message);
          }
        },
        error : e => console.warn(e)
      })
    }

    // for error toaster
    showToast = false; // Tracks toast visibility
    toastErrors: string[] = [];

    displayValidationErrors() {
      this.toastErrors = [];

      if (this.form['moduleId'].errors?.['required']) {
        this.toastErrors.push('Module is required.');
      }
      if (this.form['menuName'].errors?.['required']) {
        this.toastErrors.push('Menu Name is required.');
      }
      if (this.form['url'].errors?.['required']) {
        this.toastErrors.push('Menu URL is required.');
      }
      if (this.form['order'].errors?.['required']) {
        this.toastErrors.push('Order is required.');
      }

      this.showToast = true;

    // Auto-hide toast after a delay
      // setTimeout(() => {
      //   this.showToast = false;
      // }, 8000);
    }

    // Hide the toast
    hideToast() {
      this.showToast = false;
    }

    // edit menu
    editMenu(id: any, content: TemplateRef<any>) {
      this.isEdit = true;
      this.menuService.getMenuById(id).subscribe({
        next: (res: CustomResponse) => {
          console.log(res.data)
          if (res.success) {
            const menu = res.data;
    
            // Patch the form with the fetched data
            this.formData.patchValue({
              id: menu.id,
              moduleId: menu.moduleId,
              menuName: menu.name,
              shortName: menu.shortName,
              description: menu.description,
              url: menu.url,
              iconUrl: menu.iconUrl,
              parentMenuId: menu.parentMenuId,
              order: menu.slNo
            });
    
            // Open the modal after data is patched
            this.openModal(content);
          } else {
            console.warn('Failed to fetch menu data:', res.message);
            Swal.fire('Error!', 'Failed to fetch menu data.', 'error');
          }
        },
        error: (e) => {
          console.warn('Error fetching menu data:', e);
          Swal.fire('Error!', 'An unexpected error occurred.', 'error');
        }
      });
    }

    // sweet alert
    confirmAdd(data : any){
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, add it!'
      }).then(result => {
        if (result.isConfirmed) {
            this.addMenu(data);
          }
      });
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
            this.updateMenu(data);
          }
      });
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
          this.menuService.deleteMenu(id).subscribe({
            next : (res:CustomResponse) =>{
              if(res.success){
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
              }
            },
            error : e => console.warn(e)
          })
        }
      });
    }

}
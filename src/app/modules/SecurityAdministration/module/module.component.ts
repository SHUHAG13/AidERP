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
import { ModuleDTO } from '../../../core/SecurityAdministration/module/module.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../../services/common/sweetalert.service';
import { ModuleService } from '../../../services/SecurityAdministration/module/module.service';
import { CustomResponse } from '../../../core/common/response';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-module',
  standalone: true,
  imports: [
    TableModule,InputTextModule,
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
  templateUrl: './module.component.html'
})
export class ModuleComponent implements OnInit{
breadCrumbItems!: Array<{}>;
  modules : ModuleDTO[] = [];
  totalRecords : number = 0;
  formData!: FormGroup;
  submitted : boolean = false;
  isEdit : boolean = false;
  isDialogVisible: boolean = false;

  private formBuilder = inject(FormBuilder);
  private modalService = inject(NgbModal);
  private sweetAlertService = inject(SweetalertService);
  private moduleService = inject(ModuleService)
  constructor(){}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Security Administration' }, { label: 'Role', active: true }];
    this.loadModules();
    this.resetForm();   
  }

  clear(table: Table) {
    table.clear();
  }

  loadModules(){
    this.moduleService.getAllModules().subscribe({
      next : res => this.modules = res.data,
      error : err => console.error(err)
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
      name: ['',[Validators.required]],
      shortName: [''],
      description: [''],
      iconUrl: [''],
      slNo: ['']
    })
  }

  get form() {
    return this.formData.controls;
  }


  // save
  saveModule(){
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
        Name: this.formData.value.name,
        ShortName: this.formData.value.shortName,
        Description: this.formData.value.description,
        IconURL: this.formData.value.iconUrl,
        SLNo: this.formData.value.slNo
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

    if (this.form['name'].errors?.['required']) {
      this.toastErrors.push('Name is required.');
    }

    this.showToast = true;
  }

  // sweet alert
  confirmAdd(data : any){
    this.sweetAlertService.confirmation('add')
      .then((confirmed)=>{
        if(confirmed){
          this.addModule(data);
        }
      })
  }

  addModule(model : any){
    this.moduleService.addModule(model).subscribe({
      next : (res : CustomResponse) => {
        console.log(res)
        if (res.success) {
          this.modalService.dismissAll(); // Close the modal
          Swal.fire('Added!', 'Your module has been added.', 'success')
          this.ngOnInit(); // Refresh the module list
        } else {
          console.warn('Module addition failed:', res.message);
          Swal.fire(res.message, res.data, 'warning')
        }
      },
      error : e => {
        console.warn(e)
        Swal.fire(e.error.message, e.error.data, 'warning')
      }
    })
  }

  // edit module
  editModule(id: any) {
    this.isEdit = true;
    this.moduleService.getModuleById(id).subscribe({
      next: (res: CustomResponse) => {
        if (res.success) {
          const module = res.data;
  
          // Patch the form with the fetched data
          this.formData.patchValue({
            id: module.id,
            name: module.name,
            shortName: module.shortName,
            description: module.description,
            iconUrl: module.iconURL,
            slNo: module.slNo
          });
  
          // Open the dialog after data is patched
          this.isDialogVisible = true;
        } else {
          console.warn('Failed to fetch module data:', res.message);
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
          this.updateModule(data);
        }
      })
  }

  updateModule(model : any){
    this.moduleService.updateModule(model).subscribe({
      next : (res : CustomResponse) => {
        if (res.success) {
          this.modalService.dismissAll(); // Close the modal
          Swal.fire('Updated!', 'Your module has been updated.', 'success')
          this.ngOnInit(); // Refresh the module list
        } else {
          console.warn('Module updating failed:', res.message);
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
          this.moduleService.deleteModule(id).subscribe({
            next : (res:CustomResponse) =>{
              if(res.success){
                Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
                this.ngOnInit(); // Refresh the module list
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

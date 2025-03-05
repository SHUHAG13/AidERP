import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ErrorToastComponent } from '../../../shared/components/error-toast/error-toast.component';
import { Dialog } from 'primeng/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatusInfoDTO } from '../../../core/SecurityAdministration/statusInfo/statusInfo.model';
import { SweetalertService } from '../../../services/common/sweetalert.service';
import { StatusInfoService } from '../../../services/SecurityAdministration/statusInfo/status-info.service';
import { CustomResponse } from '../../../core/common/response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-status-info',
  standalone: true,
  imports: [CommonModule,TableModule,InputTextModule,IconFieldModule,InputIconModule,ButtonModule,ReactiveFormsModule,ErrorToastComponent,Dialog,NgSelectModule],
  templateUrl: './status-info.component.html'
})
export class StatusInfoComponent implements OnInit{

  statusInfos : StatusInfoDTO[] = [];
  totalRecords : number = 0;
  formData!: FormGroup;
  submitted : boolean = false;
  isEdit : boolean = false;
  isDialogVisible: boolean = false;

  private formBuilder = inject(FormBuilder);
  private sweetAlertService = inject(SweetalertService);
  private modalService = inject(NgbModal);
  private statusInfoService = inject(StatusInfoService);

  ngOnInit(): void {
    this.loadStatusInfos();
    this.resetForm();
  }

  loadStatusInfos(){
    this.statusInfoService.getAllStatusInfos().subscribe({
      next : res => this.statusInfos = res.data,
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
      id: ['',[Validators.required]],
      name: ['',[Validators.required]]
    })
  }

  get form() {
    return this.formData.controls;
  }

  // save
  saveStatusInfo(){
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
        name: this.formData.value.name
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
    if (this.form['id'].errors?.['required']) {
      this.toastErrors.push('Status ID is required.');
    }
    if (this.form['name'].errors?.['required']) {
      this.toastErrors.push('Status Name is required.');
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
          this.addStatusInfo(data);
        }
      })
  }

  addStatusInfo(model : any){
    this.statusInfoService.addStatusInfo(model).subscribe({
      next : (res : CustomResponse) => {
        console.log(res)
        if (res.success) {
          this.modalService.dismissAll(); // Close the modal
          Swal.fire('Added!', 'Your status has been added.', 'success')
          this.ngOnInit(); // Refresh the status infos list
        } else {
          console.warn('Status Info addition failed:', res.message);
          Swal.fire(res.message, res.data, 'warning')
        }
      },
      error : e => {
        console.warn(e)
        Swal.fire(e.error.message, e.error.data, 'warning')
      }
    })
  }


  // edit status info
  editStatusInfo(id: any) {
    this.isEdit = true;
    this.statusInfoService.getStatusInfoById(id).subscribe({
      next: (res: CustomResponse) => {
        if (res.success) {
          const statusInfo = res.data;
  
          // Patch the form with the fetched data
          this.formData.patchValue({
            id: statusInfo.id,
            name: statusInfo.name
          });
  
          // Open the dialog after data is patched
          this.isDialogVisible = true;
        } else {
          console.warn('Failed to fetch status info data:', res.message);
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
          this.updateStatusInfo(data);
        }
      })
  }

  updateStatusInfo(model : any){
    this.statusInfoService.updateStatusInfo(model).subscribe({
      next : (res : CustomResponse) => {
        if (res.success) {
          this.modalService.dismissAll(); // Close the modal
          Swal.fire('Updated!', 'Your status info has been updated.', 'success')
          this.ngOnInit(); // Refresh the status info list
        } else {
          console.warn('Status info updating failed:', res.message);
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
          this.statusInfoService.deleteStatusInfo(id).subscribe({
            next : (res:CustomResponse) =>{
              if(res.success){
                Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
                this.ngOnInit(); // Refresh the status info list
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

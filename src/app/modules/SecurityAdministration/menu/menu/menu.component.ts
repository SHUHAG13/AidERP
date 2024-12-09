import { Component, inject, NO_ERRORS_SCHEMA, OnInit, TemplateRef } from '@angular/core';
import { MenuListDTO } from '../../../../core/SecurityAdministration/menu/menu.model';
import { MenuService } from '../../../../services/SecurityAdministration/menu/menu.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModuleService } from '../../../../services/SecurityAdministration/module/module.service';
import { ModuleDTO } from '../../../../core/SecurityAdministration/module/module.model';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgSelectModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{

  menuList: MenuListDTO[] = []
  moduleList: ModuleDTO[] = []
  formData!: FormGroup;
  submitted = false;

  private menuService = inject(MenuService);
  private moduleService = inject(ModuleService);
  private formBuilder = inject(FormBuilder);
  private modalService = inject(NgbModal)

  ngOnInit(): void {
    this.getAllMenus();
    this.getAllModule();

    this.formData = this.formBuilder.group({
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

    }
}
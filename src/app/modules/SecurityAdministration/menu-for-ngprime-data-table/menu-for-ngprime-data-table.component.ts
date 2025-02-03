import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'; 
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../../services/securityAdministration/menu/menu.service';

@Component({
  selector: 'app-menu-for-ngprime-data-table',
  standalone: true,
  imports: [TableModule, ButtonModule,TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule],
  templateUrl: './menu-for-ngprime-data-table.component.html',
  styleUrl: './menu-for-ngprime-data-table.component.scss'
})
export class MenuForNGPrimeDataTableComponent {
  menus: any[] = [];
  totalRecords: number = 0;

  constructor(private menuService : MenuService){}

  loadMenus(event: any) {
    const { first, rows, sortField, sortOrder } = event;
    this.menuService.getMenusForDataTable(first, rows, sortField, sortOrder).subscribe(data => {
      this.menus = data.data;
      this.totalRecords = data.data;
    });
  }
}

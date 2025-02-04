import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'; 
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { MenuService } from '../../../services/SecurityAdministration/menu/menu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-for-ngprime-data-table',
  standalone: true,
  imports: [TableModule, ButtonModule,TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule,CommonModule],
  templateUrl: './menu-for-ngprime-data-table.component.html'
})
export class MenuForNGPrimeDataTableComponent implements OnInit{
  menus: any[] = [];
  totalRecords: number = 0;

  constructor(private menuService : MenuService){}

  ngOnInit(): void {
    this.loadMenus({})
  }

  loadMenus(event: any) {
    console.log(event)
    const { first, rows, sortField, sortOrder } = event;
    this.menuService.getMenusForDataTable(1, rows,'').subscribe(data => {
      this.menus = data.data.data;
      this.totalRecords = data.data.data.length;
    });
  }
}

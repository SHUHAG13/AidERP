import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

import { MenuService } from '../../../services/SecurityAdministration/menu/menu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-for-ngprime-data-table',
  standalone: true,
  imports: [TableModule, IconFieldModule, InputTextModule, InputIconModule,CommonModule],
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
    const first1 = event.first; // First record index (start of current page)
    const rows1 = event.rows;   // Number of rows per page (e.g., 5, 10, 20)
    const page = Math.floor(first1 / rows1); // Calculate the zero-based page number
    const { rows, sortField, sortOrder } = event;
    this.menuService.getMenusForDataTable(page, rows,'').subscribe(data => {
      console.log(data)
      this.menus = data.data.data;
      this.totalRecords = data.data.totalRecords;
      console.log(this.totalRecords)
    });
  }
}

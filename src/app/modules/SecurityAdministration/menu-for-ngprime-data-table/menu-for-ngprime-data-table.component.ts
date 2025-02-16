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
    this.loadMenus({first:0,rows:5})
  }

  loadMenus(event: any) {
    console.log(event)
    const first = event.first; // First record index (start of current page)
    const rows = event.rows;   // Number of rows per page (e.g., 5, 10, 20)
    const pageNumber = Math.floor(first / rows); // Calculate the zero-based page number
    const searchValue = event.globalFilter;

    const params = {
      PageNumber: pageNumber,
      PageSize: rows,
      SearchValue: searchValue
    };

    this.menuService.getMenusForDataTable(params).subscribe(data => {
      console.log(data)
      this.menus = data.data.data;
      this.totalRecords = data.data.totalRecords;
      console.log(this.totalRecords)
    });
  }
}

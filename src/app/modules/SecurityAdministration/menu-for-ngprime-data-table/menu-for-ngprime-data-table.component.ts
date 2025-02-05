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
    const { first, rows, sortField, sortOrder } = event;
    this.menuService.getMenusForDataTable(1, rows,'').subscribe(data => {
      this.menus = data.data.data;
      this.totalRecords = data.data.data.length;
    });
  }
}

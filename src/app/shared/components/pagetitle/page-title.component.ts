import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-title',
  standalone: true,
  imports: [],
  templateUrl: './page-title.component.html'
})
export class PageTitleComponent implements OnInit {

  @Input() breadcrumbItems!: any[];
  @Input() title!: string;

  constructor() { }

  ngOnInit(){
  }
}

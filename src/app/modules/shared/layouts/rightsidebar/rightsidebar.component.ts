import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../services/event.service';

import { LAYOUT_WIDTH, SIDEBAR_TYPE, TOPBAR } from '../layouts.model';
import { CommonModule } from '@angular/common';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ClickOutsideModule } from 'ng-click-outside';

@Component({
  selector: 'app-rightsidebar',
  standalone: true,
  imports: [SimplebarAngularModule,ClickOutsideModule],
  templateUrl: './rightsidebar.component.html',
  styleUrl: './rightsidebar.component.scss'
})
export class RightsidebarComponent implements OnInit {

  isVisible: string = '';
  attribute: any = '';

  width: string = '';
  sidebartype: string = '';
  topbar: string = '';

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.width = LAYOUT_WIDTH;
    this.sidebartype = SIDEBAR_TYPE;
    this.topbar = TOPBAR;

    /**
     * horizontal-vertical layput set
     */
    this.attribute = document.body.getAttribute('data-layout');
    const vertical = document.getElementById('is-layout');
    if (vertical != null) {
      vertical.setAttribute('checked', 'true');
    }
    if (this.attribute == 'horizontal') {
      vertical?.removeAttribute('checked');
    }
  }

  /**
   * Hide the sidebar
   */
  public hide() {
    document.body.classList.remove('right-bar-enabled');
  }

  /**
   * Change Topbar
   */
  changeTopbar(topbar: string) {
    this.topbar = topbar;
    this.eventService.broadcast('changeTopbar', topbar);
  }

  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout : any) {
    if (layout.target.checked == true)
      this.eventService.broadcast('changeLayout', 'vertical');
    else
      this.eventService.broadcast('changeLayout', 'horizontal');
  }

  changeWidth(width: string) {
    this.width = width;
    this.eventService.broadcast('changeWidth', width);
  }

  changeSidebartype(sidebar: string) {
    this.sidebartype = sidebar;
    this.eventService.broadcast('changeSidebartype', sidebar);
  }
}
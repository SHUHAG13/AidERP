import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input, OnChanges } from '@angular/core';
import MetisMenu from 'metismenujs';
import { EventService } from '../../../../services/event.service';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { MENU } from './menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SimplebarAngularModule } from 'simplebar-angular';
import { MenuService } from '../../../../services/SecurityAdministration/menu/menu.service';
import { ParentMenuDTO, UserModuleMenuDTO } from '../../../../core/SecurityAdministration/menu/user-module-menu-dto';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [TranslateModule,CommonModule,RouterLink,SimplebarAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('componentRef') scrollRef : any;
  @Input() isCondensed = false;
  menu: any;
  data: any;
  menuItems : any[] = [];

  menuList : UserModuleMenuDTO[] = [];

  @ViewChild('sideMenu') sideMenu! : ElementRef;

  constructor(
    private eventService: EventService, 
    private router: Router, 
    public translate: TranslateService, 
    private menuService : MenuService
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
        this._scrollElement();
      }
    });
  }

  ngOnInit() {
    this.initialize();
    this._scrollElement();
  }

  ngAfterViewInit() {
    this.menu = new MetisMenu(this.sideMenu.nativeElement);
    this._activateMenuDropdown();
  }

  toggleMenu(event : any) {
    event.currentTarget.nextElementSibling.classList.toggle('mm-show');
  }

  ngOnChanges() {
    if (!this.isCondensed && this.sideMenu || this.isCondensed) {
      setTimeout(() => {
        this.menu = new MetisMenu(this.sideMenu.nativeElement);
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }
  _scrollElement() {
    setTimeout(() => {
      const activeElements = document.getElementsByClassName("mm-active");
    
      if (activeElements.length > 0) {
        // Cast the first element in the collection to HTMLElement
        const activeElement = activeElements[0] as HTMLElement;
    
        const currentPosition = activeElement.offsetTop;  // Now offsetTop is available
    
        if (currentPosition > 500) {
          if (this.scrollRef.SimpleBar !== null) {
            this.scrollRef.SimpleBar.getScrollElement().scrollTop = currentPosition + 300;
          }
        }
      }
    }, 300);
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className : any) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');
    const links = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    // tslint:disable-next-line: prefer-for-of
    const paths = [];
    for (let i = 0; i < links.length; i++) {
      // Cast each link to an HTMLAnchorElement
      const link = links[i] as HTMLAnchorElement;
      paths.push(link.pathname);
    }
    var itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }
    if (menuItemEl) {
      menuItemEl.classList.add('active');
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement?.closest('ul');
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== 'side-menu') {
            parent3El.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');
            if (childAnchor) { childAnchor.classList.add('mm-active'); }
            if (childDropdown) { childDropdown.classList.add('mm-active'); }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== 'side-menu') {
              parent4El.classList.add('mm-show');
              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== 'side-menu') {
                parent5El.classList.add('mm-active');
                const childanchor = parent5El.querySelector('.is-parent');
                if (childanchor && parent5El.id !== 'side-menu') { childanchor.classList.add('mm-active'); }
              }
            }
          }
        }
      }
    }

  }

  /**
   * Initialize
   */
  initialize(): void {
    this.menuItems = MENU;
    this.menuList = this.menuService.MenuList;
    console.log(this.menuList);
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  // hasItems(item: MenuItem) {
  //   return item.subItems !== undefined ? item.subItems.length > 0 : false;
  // }

  hasMenus(item : ParentMenuDTO){
    return item.menus !== undefined ? item.menus.length > 0 : false;
  }
}

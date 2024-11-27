import { Injectable } from '@angular/core';
import { MasterService } from '../common/master.service';
import { CustomResponse } from '../../core/models/common/response';
import { UserModuleMenuDTO } from '../../core/models/layouts/user-module-menu-dto';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private masterSevice : MasterService) { }

  private _menuList: UserModuleMenuDTO[] = [];

  get MenuList(): UserModuleMenuDTO[] {
    if (this._menuList.length === 0) {
      const storedMenuList = localStorage.getItem('MenuList');
      if (storedMenuList) {
        this._menuList = JSON.parse(storedMenuList);
      }
    }
    return this._menuList;
  }

  set MenuList(menuList: UserModuleMenuDTO[]) {
    this._menuList = menuList;
    localStorage.setItem('MenuList', JSON.stringify(menuList));
  }

  getMenuListByUserId(userId : any){
    return this.masterSevice.get<CustomResponse>(`Menu/GetByUserId/${userId}`);
  }
}

import { Injectable } from '@angular/core';
import { MasterService } from '../../common/master.service';
import { CustomResponse } from '../../../core/common/response';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private masterSevice : MasterService) { }

  getAllRoles(){
    return this.masterSevice.get<CustomResponse>('Role/Getall');
  }
}
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

  getRoleById(id : any){
    return this.masterSevice.get<CustomResponse>(`Role/GetById?id=${id}`)
  }
  
  addRole(role : any){
    return this.masterSevice.post<CustomResponse>('Role/Add',role);
  }

  updateRole(role : any){
    return this.masterSevice.put<CustomResponse>('Role/Update',role);
  }

  deleteRole(id: any){
    return this.masterSevice.put<CustomResponse>('Role/Delete',id);
  }
}
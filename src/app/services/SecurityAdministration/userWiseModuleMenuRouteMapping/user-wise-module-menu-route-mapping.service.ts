import { Injectable } from '@angular/core';
import { MasterService } from '../../common/master.service';
import { CustomResponse } from '../../../core/common/response';

@Injectable({
  providedIn: 'root'
})
export class UserWiseModuleMenuRouteMappingService {

  constructor(private masterSevice : MasterService) { }

  getAll(){
    return this.masterSevice.get<CustomResponse>('UserWiseModuleMenuRouteMapping/Getall');
  }

  getById(id : any){
    return this.masterSevice.get<CustomResponse>(`UserWiseModuleMenuRouteMapping/GetById?id=${id}`)
  }
  
  add(model : any){
    return this.masterSevice.post<CustomResponse>('UserWiseModuleMenuRouteMapping/Add',model);
  }

  update(model : any){
    return this.masterSevice.put<CustomResponse>('UserWiseModuleMenuRouteMapping/Update',model);
  }

  delete(id: any){
    return this.masterSevice.put<CustomResponse>('UserWiseModuleMenuRouteMapping/Delete',id);
  }
}

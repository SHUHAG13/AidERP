import { Injectable } from '@angular/core';
import { MasterService } from '../../common/master.service';
import { CustomResponse } from '../../../core/common/response';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(private masterSevice : MasterService) { }

  getAllModules(){
    return this.masterSevice.get<CustomResponse>('Module/GetAll');
  }
  
  getModuleById(id : any){
    return this.masterSevice.get<CustomResponse>(`Module/GetById?id=${id}`)
  }
  
  addModule(module : any){
    return this.masterSevice.post<CustomResponse>('Module/Add',module);
  }

  updateModule(module : any){
    return this.masterSevice.put<CustomResponse>('Module/Update',module);
  }

  deleteModule(id: any){
    return this.masterSevice.put<CustomResponse>('Module/Delete',id);
  }
}

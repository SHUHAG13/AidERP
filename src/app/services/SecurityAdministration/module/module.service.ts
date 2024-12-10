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
}

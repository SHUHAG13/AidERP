import { Injectable } from '@angular/core';
import { MasterService } from '../../common/master.service';
import { CustomResponse } from '../../../core/common/response';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor(private masterSevice : MasterService) { }

  getAllTenants(){
    return this.masterSevice.get<CustomResponse>('Tenant/Getall');
  }
}
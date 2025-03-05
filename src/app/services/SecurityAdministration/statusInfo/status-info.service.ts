import { Injectable } from '@angular/core';
import { MasterService } from '../../common/master.service';
import { CustomResponse } from '../../../core/common/response';

@Injectable({
  providedIn: 'root'
})
export class StatusInfoService {

  constructor(private masterSevice : MasterService) { }

  getAllStatusInfos(){
    return this.masterSevice.get<CustomResponse>('StatusInfo/Getall');
  }

  getStatusInfoById(id : any){
    return this.masterSevice.get<CustomResponse>(`StatusInfo/GetById?id=${id}`)
  }
  
  addStatusInfo(StatusInfo : any){
    return this.masterSevice.post<CustomResponse>('StatusInfo/Add',StatusInfo);
  }

  updateStatusInfo(StatusInfo : any){
    return this.masterSevice.put<CustomResponse>('StatusInfo/Update',StatusInfo);
  }

  deleteStatusInfo(id: any){
    return this.masterSevice.delete<CustomResponse>(`StatusInfo/HardDelete?id=${id}`);
  }
}

import { Injectable } from '@angular/core';
import { MasterService } from '../../common/master.service';
import { CustomResponse } from '../../../core/common/response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private masterSevice : MasterService) { }

  getAllUsers(){
    return this.masterSevice.get<CustomResponse>('User/Getall');
  }

  addUser(user:any){
    return this.masterSevice.post<CustomResponse>('User/Add',user);
  }

  deleteUser(id:any){
    return this.masterSevice.put<CustomResponse>(`User/Delete?id=${id}`,null);
  }

  getUserById(id:number){
    return this.masterSevice.get<CustomResponse>(`User/GetById?id=${id}`)
  }
  updateUser(user:any){
    return this.masterSevice.put<CustomResponse> (`User/Update`,user)
  }
}

import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {

  confirmation(message: string): Promise<boolean>{
    if(message == 'add'){
      return Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, add it!'
      }).then(result => {
        return result.isConfirmed;
      });
    }else if(message == 'update'){
      return Swal.fire({
              title: 'Are you sure?',
              text: 'You won\'t be able to revert this!',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#34c38f',
              cancelButtonColor: '#f46a6a',
              confirmButtonText: 'Yes, update it!'
            }).then(result => {
              return result.isConfirmed;
            });
    }else if(message == 'delete'){
      return Swal.fire({
              title: 'Are you sure?',
              text: 'You won\'t be able to revert this!',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#34c38f',
              cancelButtonColor: '#f46a6a',
              confirmButtonText: 'Yes, delete it!'
            }).then(result => {
              return result.isConfirmed;
            });
    }else{
      return Swal.fire({
              title: 'Are you sure?',
              text: 'You won\'t be able to revert this!',
              icon: 'warning',
              showCancelButton: true,
              cancelButtonColor: '#f46a6a',
            }).then(result => {
              return false;
            });
    }
  }
}

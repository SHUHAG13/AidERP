import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private reqCount  = 0;

  constructor(private spinner : NgxSpinnerService) { }
  public show(){
    this.reqCount++;
    if(this.reqCount == 1) this.spinner.show();
  }
  public hide(){
    if(this.reqCount == 0) return;
    this.reqCount--;
    if(this.reqCount == 0) this.spinner.hide();
  }
}

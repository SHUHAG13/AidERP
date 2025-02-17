import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.scss'
})
export class ErrorToastComponent implements OnChanges{

  @Input() toastErrors!: string[];
  @Input() showToast!: boolean;

  isVisable : boolean = this.showToast;

  ngOnChanges(changes: SimpleChanges): void {
    this.isVisable = this.showToast;
  }
  
  // Hide the toast
  hideToast() {
    this.isVisable = false;
  }

}

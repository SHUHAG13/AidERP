import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone : true
})
export class StatusPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 0:
        return 'Inactive';
      case 1:
        return 'Active';
      case 2:
        return 'Deleted';
      default:
        return 'Unknown';
    }
  }
}

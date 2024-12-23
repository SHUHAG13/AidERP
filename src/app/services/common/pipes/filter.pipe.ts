import { Pipe, PipeTransform } from '@angular/core';
import { Common } from '../common';

@Pipe({
  name: 'SearchFilter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(Data: any[], searchText: string): any[] {
        
    if (Common.getLength(Data) == 0) {return [];}
    
    if (Common.isNullOrEmpty(searchText)) {return Data;}

    const searchTerm = searchText.trim().toLowerCase();

    return Data.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm)
      ));
}
}


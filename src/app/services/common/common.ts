import { HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

export class Common{

    public static getToken(){
        return "Bearer " + localStorage.getItem("token");
    }

    public static getApiBaseUrl(){
        return environment.apiUrl;
    }

    public static getApiHeader() {
        const headers = new HttpHeaders()
        .set("Content-Type", "application/json; charset=utf-8")
        .set("Authorization", this.getToken());
  
        return { headers: headers };
    }

    public static getLength(Data: any[]): number{
        if(Data!=null && Data.length>0) return Data.length;
        else return 0;
    }

    public static isNullOrEmpty(str: string){
        if(str==null || str== undefined ||str == "undefined" || str == "") return true;
        else return false;
    }

    // for table sorting

    public static sortColumn: any = '';
    public static sortDirection: 'asc' | 'desc' = 'asc';

    public static arraySort<T>(array: T[], column: keyof T): T[] {
        
        if (!array || array.length === 0) return array; // Return if array is empty

        // Toggle the direction if the same column is clicked
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // Set new column and default to ascending order
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        // Sort the array based on the column and direction
        array.sort((a, b) => {
            const valueA = a[column] || '';  // Use empty string if undefined
            const valueB = b[column] || '';  // Use empty string if undefined

            if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        // Return the sorted array
        return array;
    }
}
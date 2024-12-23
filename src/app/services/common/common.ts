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
<<<<<<< HEAD
    }   
=======
    }

    public static getLength(Data: any[]): number{
        if(Data!=null && Data.length>0) return Data.length;
        else return 0;
    }

    public static isNullOrEmpty(str: string){
        if(str==null || str== undefined ||str == "undefined" || str == "") return true;
        else return false;
    }
    
>>>>>>> 4c9dae7255cb319221ce639cedf43c684a958f18
}
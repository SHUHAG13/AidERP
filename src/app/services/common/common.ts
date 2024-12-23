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
}
import { HttpHeaders } from "@angular/common/http";

export class Common{

    public static getToken(){
        return "Bearer " + localStorage.getItem("token");
    }

    public static getApiBaseUrl(){
        return 'https://localhost:7226'
    }

    public static getApiHeader() {
        const headers = new HttpHeaders()
        .set("Content-Type", "application/json; charset=utf-8")
        .set("Authorization", this.getToken());
  
        return { headers: headers };
    }
}
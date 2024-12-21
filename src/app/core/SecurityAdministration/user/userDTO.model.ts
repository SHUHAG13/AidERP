export interface UserDTO{
    id:number;
    name:string;
    password:string;
    roleName : string;
    tenantName:string
    createdBy:string;
    createdOn : Date;
    updatedBy : string;
    updatedOn:Date;
    statusName : string;
    description:string;
}
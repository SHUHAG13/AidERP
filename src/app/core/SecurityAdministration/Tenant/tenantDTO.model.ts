export interface TenantDTO{
    id : number;
    tenantName : string;
    parentTenantId : number;
    createdBy:string;
    createdOn : Date;
    updatedBy : string;
    updatedOn : Date;
    status : number;
}
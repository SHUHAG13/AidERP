export class MenuListDTO {
    id!: number;
    name!: string;
    shortName!: string;
    url!: string;
    iconUrl?: string;
    slNo!: number;
    parentMenuId?: number | null;
    moduleId!: number;
    createdBy!: string;
    createdOn!: Date;
    updatedBy!: string;
    updatedOn!: Date;
    status!: boolean;
}

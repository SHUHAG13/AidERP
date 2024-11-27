export class UserModuleMenuDTO {
    moduleId!: number;
    moduleName!: string;
    moduleOrder!: number;
    parentMenus!: ParentMenuDTO[];
}

export class ParentMenuDTO {
    parentMenuId!: number;
    parentMenuName!: string;
    parentMenuOrder!: number;
    menuIconURL?: string;
    menus!: MenuDTO[];
}

export class MenuDTO {
    menuId!: number;
    menuName!: string;
    menuURL!: string;
    menuIconURL?: string;
    menuOrder!: number;
    parentMenuId?: number | null;
    parentModuleId!: number;
}
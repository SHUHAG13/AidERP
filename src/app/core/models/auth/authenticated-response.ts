export interface AuthenticatedResponse {
    token: string ;
    refreshToken: string ;
    role: string;
    applicationUser: any;
}

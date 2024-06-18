export type AdminAccount = {
    accountId:string,
    name: string,
    email: string,
    role: string,
    createdAt:string
}

export interface LoadAdminsAccount{
    loadAdmins() :Promise<AdminAccount[]>
}

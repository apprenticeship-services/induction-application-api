export interface DeleteAccount{
    deleteById(accountId:string): Promise<boolean>
}

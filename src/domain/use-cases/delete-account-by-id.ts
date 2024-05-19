export interface DeleteAccountById{
    deleteById(accountId:string): Promise<boolean>
}

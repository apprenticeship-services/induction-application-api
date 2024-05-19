export interface DeleteAccountByIdRepository{
    deleteById(accountId: string):Promise<boolean>
}

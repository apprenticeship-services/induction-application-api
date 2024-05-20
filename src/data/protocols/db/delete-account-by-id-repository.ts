export interface DeleteAccountByIdRepository{
    deleteById(accountId: string, transactionOps?:object):Promise<boolean>
}

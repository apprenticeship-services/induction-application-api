export interface DeleteApprenticeInformationByAccountIdRepository{
    deleteById(accountId: string, transactionOps:object):Promise<boolean>
}

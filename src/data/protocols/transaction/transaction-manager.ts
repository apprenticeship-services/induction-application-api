export interface TransactionManager{
    executeTransaction<T>(transaction: () => Promise<T>):Promise<T>
}

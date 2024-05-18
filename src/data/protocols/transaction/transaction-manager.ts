export interface TransactionManager{
    executeTransaction<T>(transaction: (session?: any) => Promise<T>):Promise<T>
}

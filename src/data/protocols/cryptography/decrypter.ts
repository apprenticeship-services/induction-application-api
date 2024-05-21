export type AccountTokenPayload = {
    _id: string,
    role:string
}

export interface Decrypter{
     decrypt(token:string):Promise<AccountTokenPayload>
}

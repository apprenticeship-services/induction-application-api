export type EncryptDetails = {
    _id: string,
    role: string
}

export interface Encrypter {
    encrypt(details: EncryptDetails): Promise<string>
}

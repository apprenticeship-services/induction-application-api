export type HttpRequest = {
    body?: any,
    params?: any,
    cookies?:any,
    accountId?: string
}

export type HeaderType = {
    [key: string]: {
        type: string,
        value: string,
        options: object
    }
}

export type HttpResponse = {
    statusCode: number,
    body: any,
    headers?: HeaderType
}

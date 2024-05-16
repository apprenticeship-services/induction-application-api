export type HttpRequest = {
    body?:any,
}

export type HeaderType = {
    [key: string]: {
      value: string,
      options: object
    }
}

export type HttpResponse = {
    statusCode: number,
    body: any,
    headers?: HeaderType
}

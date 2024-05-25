export type NodemailerAttachments = {
    filename: string,
    path: string,
    contentType?: string
}

export type NodemailerMessage = {
    from: string,
    to: string,
    subject: string,
    html: string,
    attachments?:NodemailerAttachments[]
}

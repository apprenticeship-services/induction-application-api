import { Collection, MongoClient, WithId, Document } from 'mongodb'

export class MongoHelper {
  static client: MongoClient = null
  static uri: string = null

  static async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = (await MongoClient.connect(uri))
  }

  static async disconnect (): Promise<void> {
    if (this.client) {
      await this.client.close()
    }
    this.client = null
  }

  static async getCollection (collection: string): Promise<Collection> {
    if (!this.client?.db()) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(collection)
  }

  static mapObjectId<T> (dataObject: WithId<Document>): T {
    if (!dataObject) return null
    const _idToString = dataObject._id.toString()
    return {
      ...dataObject,
      _id: _idToString
    } as T
  }
}

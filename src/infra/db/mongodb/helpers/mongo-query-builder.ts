export class MongoQueryBuilder {
  private readonly query = []

  match (data: object): MongoQueryBuilder {
    this.query.push({
      $match: data
    })
    return this
  }

  unwind (data: object): MongoQueryBuilder {
    this.query.push({
      $unwind: data
    })
    return this
  }

  lookup (data: object): MongoQueryBuilder {
    this.query.push({
      $lookup: data
    })
    return this
  }

  sort (data: object): MongoQueryBuilder {
    this.query.push({
      $sort: data
    })
    return this
  }

  project (data: object): MongoQueryBuilder {
    this.query.push({
      $project: data
    })
    return this
  }

  build (): object[] {
    return this.query
  }
}

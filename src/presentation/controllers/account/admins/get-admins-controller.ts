import { LoadAdminsAccount } from '@/domain/use-cases/load-admins-account'
import { serverError, success } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class GetAdminsController implements Controller {
  constructor (private readonly loadAdminsAccount: LoadAdminsAccount) {
    this.loadAdminsAccount = loadAdminsAccount
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const admins = await this.loadAdminsAccount.loadAdmins()
      return success(admins)
    } catch (error) {
      return serverError(error)
    }
  }
}

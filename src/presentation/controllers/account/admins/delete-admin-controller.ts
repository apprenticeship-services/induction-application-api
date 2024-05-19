import { DeleteAccountById } from '@/domain/use-cases/delete-account-by-id'
import { LoadAccountById } from '@/domain/use-cases/load-account-by-id'
import { AccountNotFoundError } from '@/presentation/errors/account-not-found-error'
import { DeleteError } from '@/presentation/errors/delete-error'
import { noContent, notFound, serverError, success } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class DeleteAdminController implements Controller {
  constructor (
        private readonly loadAccountById: LoadAccountById,
      private readonly deleteAccountById: DeleteAccountById) {
    this.loadAccountById = loadAccountById
    this.deleteAccountById = deleteAccountById
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params
      const account = await this.loadAccountById.loadById(id)
      if (!account) {
        return notFound(new AccountNotFoundError())
      }

      const deleteResult = await this.deleteAccountById.deleteById(account._id)
      if (!deleteResult) {
        return serverError(new DeleteError('Account deletion failed'))
      }

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
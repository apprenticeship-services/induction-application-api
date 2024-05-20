import { DeleteAccountById } from '@/domain/use-cases/delete-account-by-id'
import { LoadAccountById } from '@/domain/use-cases/load-account-by-id'
import { AccountNotFoundError } from '@/presentation/errors/account-not-found-error'
import { DeleteError } from '@/presentation/errors/delete-error'
import { badRequest, noContent, notFound, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Validator } from '@/presentation/protocols/validator'

export class DeleteApprenticeController implements Controller {
  constructor (private readonly idParamValidator: Validator,
        private readonly loadAccountById: LoadAccountById,
        private readonly deleteApprenticeAccountById: DeleteAccountById) {
    this.idParamValidator = idParamValidator
    this.loadAccountById = loadAccountById
    this.deleteApprenticeAccountById = deleteApprenticeAccountById
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.idParamValidator.validate(request.params)
      if (error) {
        return badRequest(error)
      }
      const { id } = request.params
      const account = await this.loadAccountById.loadById(id)
      if (!account || account.role !== 'apprentice') {
        return notFound(new AccountNotFoundError())
      }

      const deleteResult = await this.deleteApprenticeAccountById.deleteById(account._id)
      if (!deleteResult) {
        return serverError(new DeleteError('Account deletion failed'))
      }

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

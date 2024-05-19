import { DeleteAccountById } from '@/domain/use-cases/delete-account-by-id'
import { LoadAccountById } from '@/domain/use-cases/load-account-by-id'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class DeleteAdminController implements Controller {
  constructor (
        private readonly loadAccountById: LoadAccountById,
      private readonly deleteAccountById: DeleteAccountById) {
    this.loadAccountById = loadAccountById
    this.deleteAccountById = deleteAccountById
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const { id } = request.params
    const account = await this.loadAccountById.loadById(id)
    return null
  }
}

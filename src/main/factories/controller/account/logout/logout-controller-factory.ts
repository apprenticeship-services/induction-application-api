import { LogoutController } from '@/presentation/controllers/account/logout/logout-controller'
import { Controller } from '@/presentation/protocols'

export const logoutControllerFactory = (): Controller => {
  return new LogoutController()
}

import { LoadAdminsRepository } from '@/data/protocols/db/load-admins-account'
import { AdminAccount } from '@/domain/use-cases/load-admins-account'
import { DbLoadAdminsAccount } from './db-load-admins-account'

describe('DbLoadAdminsAccount', () => {
  let loadAdminsRepositoryStub: LoadAdminsRepository
  let sut: DbLoadAdminsAccount

  beforeEach(() => {
    loadAdminsRepositoryStub = {
      loadAdmins: jest.fn()
    }
    sut = new DbLoadAdminsAccount(loadAdminsRepositoryStub)
  })

  test('should call LoadAdminsRepository', async () => {
    const loadAdminsSpy = jest.spyOn(loadAdminsRepositoryStub, 'loadAdmins')

    await sut.loadAdmins()

    expect(loadAdminsSpy).toHaveBeenCalled()
  })

  test('should return a list of admins on success', async () => {
    const admins: AdminAccount[] = [
      { name: 'Admin 1', email: 'admin1@example.com', role: 'admin', createdAt: '2024-01-01' },
      { name: 'Admin 2', email: 'admin2@example.com', role: 'admin', createdAt: '2024-01-02' }
    ]
    jest.spyOn(loadAdminsRepositoryStub, 'loadAdmins').mockResolvedValue(admins)

    const result = await sut.loadAdmins()

    expect(result).toEqual(admins)
  })

  test('should throw if LoadAdminsRepository throws', async () => {
    const error = new Error('any_error')
    jest.spyOn(loadAdminsRepositoryStub, 'loadAdmins').mockRejectedValue(error)

    const promise = sut.loadAdmins()

    await expect(promise).rejects.toThrow(error)
  })
})

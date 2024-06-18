import { DateParamValidatorAdapter } from './date-param-validator-adapter'

describe('DateParamValidator', () => {
  let validator: DateParamValidatorAdapter

  beforeEach(() => {
    validator = new DateParamValidatorAdapter()
  })

  test('should return true for a valid date string', () => {
    const validDate = '2024-05-01T00:00:00.000Z'
    expect(validator.isValid(validDate)).toBe(true)
  })

  test('should return false for an invalid date string', () => {
    const invalidDate = 'invalid date string'
    expect(validator.isValid(invalidDate)).toBe(false)
  })

  test('should return false for a non-existent date', () => {
    const nonExistentDate = '2024-13-01T00:00:00.000Z'
    expect(validator.isValid(nonExistentDate)).toBe(false)
  })

  test('should return true for a valid date in a different format', () => {
    const validDate = '2024-05-01'
    expect(validator.isValid(validDate)).toBe(true)
  })

  test('should return false for a malformed date string', () => {
    const malformedDate = '2024-05-01T25:00:00.000Z' // Invalid hour
    expect(validator.isValid(malformedDate)).toBe(false)
  })

  test('should return false for an empty string', () => {
    const emptyString = ''
    expect(validator.isValid(emptyString)).toBe(false)
  })

  test('should return false for a null value', () => {
    const nullValue = null
    expect(validator.isValid(nullValue)).toBe(false)
  })

  test('should return false for an undefined value', () => {
    const undefinedValue = undefined
    expect(validator.isValid(undefinedValue)).toBe(false)
  })

  test('should return false if an error is thrown', () => {
    jest.spyOn(Date.prototype, 'getTime').mockImplementationOnce(() => {
      throw new Error()
    })

    const validator = new DateParamValidatorAdapter()
    const result = validator.isValid('invalid date string')

    expect(result).toBe(false)
  })
})

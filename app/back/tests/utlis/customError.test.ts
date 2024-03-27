import CustomError from '../../src/utlis/customError'

describe('CustomError', () => {
  it('should be an instance of CustomError', () => {
    const error = new CustomError(404, 'Not Found')
    expect(error).toBeInstanceOf(CustomError)
  })

  it('should have the correct error name', () => {
    const error = new CustomError(404, 'Not Found')
    expect(error.name).toBe('CustomError')
  })

  it('should have the correct code', () => {
    const error = new CustomError(404, 'Not Found')
    expect(error.code).toBe(404)
  })

  it('should have the correct message', () => {
    const error = new CustomError(404, 'Not Found')
    expect(error.message).toBe('Not Found')
  })

  it('should throw the CustomError with correct code and message', () => {
    const throwErrorFunction = () => {
      throw new CustomError(404, 'Not Found')
    }
    expect(throwErrorFunction).toThrow(CustomError)
    expect(throwErrorFunction).toThrow('Not Found')
    try {
      throwErrorFunction()
    } catch (error) {
      if (error instanceof CustomError) {
        expect(error.code).toBe(404)
        expect(error.message).toBe('Not Found')
      }
    }
  })
})

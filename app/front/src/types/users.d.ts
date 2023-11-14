declare type Users = {
  name: string
  role: {
    seller: boolean
    buyer: boolean
  }
  email: string
  password: string
  passwordConfirm: string
  confirmationCode: string
}

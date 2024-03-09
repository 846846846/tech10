declare type Products = {
  id: string
  name: string
  explanation: string
  price: string
  image: Array<any>
  category: string
  owner: string
}

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

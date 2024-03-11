interface Products {
  id: string
  name: string
  explanation: string
  price: string
  image: Array<any>
  category: string
  owner: string
}

interface Users {
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
interface Orders {
  productId: string
  productName: string
  price: string
  quantity: number
}

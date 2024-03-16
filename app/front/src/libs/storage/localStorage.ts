export default class LocalStorageLib {
  private keyList: string[]

  constructor() {
    this.keyList = ['jwtToken', 'cart']
  }

  // jwtToken.
  public getJwtToken() {
    const value = localStorage.getItem(this.keyList[0])
    return value ? JSON.parse(value) : null
  }

  public setJwtToken(value: string) {
    localStorage.setItem(this.keyList[0], JSON.stringify(value))
  }

  public removeJwtToken() {
    localStorage.removeItem(this.keyList[0])
  }

  // cart.
  public getCart(): Orders[] | null {
    const value = localStorage.getItem(this.keyList[1])
    return value ? JSON.parse(value) : null
  }

  public setCart(newOrder: Orders) {
    const nowCart = this.getCart()
    if (
      nowCart &&
      nowCart.some((item) => item.productId === newOrder.productId)
    ) {
      console.error('すでにカートに入っている商品')
      return false
    }

    if (nowCart) nowCart.push(newOrder)
    const newCart = nowCart ? nowCart : [newOrder]
    localStorage.setItem(this.keyList[1], JSON.stringify(newCart))
    return newCart
  }

  public removeCart() {
    localStorage.removeItem(this.keyList[1])
  }
}

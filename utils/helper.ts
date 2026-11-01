export class Helper {
  static convertPriceToNumber(price: string): number {
    return Number(price.replace(/[^\d.]/g, ""));
  }

  static getProductDetails() {
    return {
      productName: "MacBook Air",
      productQuantity: "1",
      totalPrice: "$1,202.00",
    };
  }

  static getLoginDetails() {
    return {
      email: "pavanol@xyz.com",
      password: "test@123",
    };
  }
}

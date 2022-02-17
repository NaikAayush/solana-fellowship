export class Helper {
  randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  totalAmtToBePaid(investment: any) {
    //If we want to keep 5% as the participation fee, then the following will be the totalAmtToBePaid
    //return investment + 0.05*investment;
    return investment;
  }

  getReturnAmount(investment: number, stakeFactor: number) {
    return investment * stakeFactor;
  }
}

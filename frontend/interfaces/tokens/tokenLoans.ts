export interface ActiveLoan {
  collateralAmount: number;
  collateralToken: string;
  collateralValue: number;
  debtAmount: number;
  debtToken: string;
  debtValue: number;
  expiration: number;
  hash: string;
  health: number;
  interestAmount: number;
  interestToken: string;
  interestValue: number;
  protocol: string;
  time: number;
}

export interface LoanOffer {
  collateralAmount: number;
  collateralToken: string;
  collateralValue: number;
  debtAmount: number;
  debtToken: string;
  debtValue: number;
  duration: number;
  hash: string;
  health: number;
  interestAmount: number;
  interestToken: string;
  interestValue: number;
  protocol: string;
  time: number;
}

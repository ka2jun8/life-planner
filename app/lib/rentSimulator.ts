type Args = {
  age: number;
  rentPrice: number;
  condoFee: number;
  renewalFee: number;
};

type Result = {
  // 毎月の支払額
  monthlyCost: number;
  // 総支払額(初期費用や管理費等も含める)
  allPayingCost: number;
};

export function rentSimulator({
  age,
  rentPrice,
  condoFee,
  renewalFee,
}: Args): Result {
  // 人生100年時代
  const yearsToLive = 100 - age;
  const monthlyCost = rentPrice + condoFee;
  const allPayingCost = (monthlyCost * 12 + renewalFee) * yearsToLive;

  return {
    monthlyCost,
    allPayingCost,
  };
}

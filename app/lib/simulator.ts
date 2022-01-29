// TODO 元利均等返済でのみ計算している
type Args = {
  age: number;
  loanYears: number;
  loanPrice: number; // 万円
  interestRate: number; // %
  otherFee: number; // マンションの管理費等(円)
  salary: number; // 年収(万円)
  isTaxDeduction: boolean; // 住宅ローン減税を考慮に入れるかどうか
};

type Result = {
  // 毎月の返済額
  monthlyReturningPrice: number;
  // 毎月の支払額
  monthlyCost: number;
  // 総返済額
  loanPlusDebtPrice: number;
  // 総支払額(初期費用や管理費等も含める)
  allPayingCost: number;
};

// 住宅ローン減税
function taxDeduction({ loanPrice, type }: { loanPrice: number; type: any }) {
  const limitYears = 13;
  const upperSalaryLimit = 2000;

  const rate = 0.7 / 100;
  const upperLimits = {
    certificated: 4500,
    zeh: 3500,
    eco: 3000,
    other: 2000,
  };
  const limit = upperLimits[type as "certificated"];
  const yearlyDeductionPrice = Math.min(loanPrice, limit) * rate;

  console.log({ yearlyDeductionPrice });

  return {
    limitYears,
    upperSalaryLimit,
    yearlyDeductionPrice,
  };
}

export function simulator({
  age,
  loanYears,
  loanPrice,
  interestRate,
  otherFee,
  salary,
  isTaxDeduction,
}: Args): Result {
  console.log({ age, loanYears, loanPrice, interestRate, otherFee });

  const returningCount = loanYears * 12;
  const monthlyRate = interestRate / 100 / 12;
  const loanAllPrice = loanPrice * 10000;

  console.log({ returningCount, monthlyRate, loanAllPrice });

  const onePlusMonthlyRateExpCount = (1 + monthlyRate) ** returningCount;

  console.log({ m: 1 + monthlyRate, onePlusMonthlyRateExpCount });

  const monthlyReturningPrice =
    (loanAllPrice * monthlyRate * onePlusMonthlyRateExpCount) /
    (onePlusMonthlyRateExpCount - 1);

  const yearlyReturningPrice = monthlyReturningPrice * 12;
  const loanPlusDebtPrice = yearlyReturningPrice * loanYears;

  console.log({ loanPlusDebtPrice });

  // 管理費は含める。ローン支払を終えれば monthlyReturningPrice は 0 になる
  const monthlyCost = monthlyReturningPrice + otherFee;

  // 人生100年時代なので100才まで払い続けると仮定する
  const monthsToLive = (100 - age) * 12;
  const allPayingCost = loanPlusDebtPrice + otherFee * monthsToLive;

  // 住宅ローン減税を計算する場合
  if (isTaxDeduction) {
    // TODO type
    const { limitYears, upperSalaryLimit, yearlyDeductionPrice } = taxDeduction(
      { loanPrice, type: "zeh" }
    );
    const monthlyDeductionPrice = yearlyDeductionPrice / 12;
    if (upperSalaryLimit > salary) {
      return {
        monthlyReturningPrice: monthlyReturningPrice - monthlyDeductionPrice,
        loanPlusDebtPrice:
          loanPlusDebtPrice - yearlyDeductionPrice * limitYears,
        monthlyCost: monthlyCost - monthlyDeductionPrice,
        allPayingCost: allPayingCost - yearlyDeductionPrice * limitYears,
      };
    }
  }

  return {
    monthlyReturningPrice,
    loanPlusDebtPrice,
    monthlyCost,
    allPayingCost,
  };
}

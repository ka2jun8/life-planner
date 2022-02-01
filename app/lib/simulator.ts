// TODO 元利均等返済でのみ計算している
type Args = {
  age: number;
  loanYears: number;
  loanPrice: number; // 万円
  interestRate: number; // %
  bonusPrice: number;
  otherFee: number; // マンションの管理費等(円)
  salary: number; // 年収(万円)
  isTaxDeduction: boolean; // 住宅ローン減税を考慮に入れるかどうか
  isChildFutureAid: boolean; // こどもみらい住宅支援事業を考慮に入れるかどうか
};

type Result = {
  // 毎月の返済額
  monthlyReturningPrice: number;
  // ボーナス月の返済額
  bonusMonthReturningPrice: number;
  // 毎月の支払額
  monthlyCost: number;
  // ボーナス月の支払額
  bonusMonthCost: number;
  // 総返済額
  allLoanPlusDebtPrice: number;
  // 総支払額(初期費用や管理費等も含める)
  allPayingCost: number;
};

// 住宅ローン減税
function taxDeduction({
  loanPrice,
  loanYears,
  monthlyReturningPrice,
  bonusMonthReturningPrice,
  salary,
  type,
}: {
  loanPrice: number;
  loanYears: number;
  monthlyReturningPrice: number;
  bonusMonthReturningPrice: number;
  salary: number;
  type: any;
}) {
  const upperSalaryLimit = 2000;

  if (salary > upperSalaryLimit) {
    return { allDeductionPrice: 0 };
  }

  const limitYears = 13;
  const applyYears = Math.min(loanYears, limitYears);
  const rate = 0.7 / 100;
  const upperLimits = {
    certificated: 4500 * 10000,
    zeh: 3500 * 10000,
    eco: 3000 * 10000,
    other: 2000 * 10000,
  };

  const limit = upperLimits[type as "certificated"];
  const yearlyReturningPrice =
    monthlyReturningPrice * 10 + bonusMonthReturningPrice * 2;
  let remainLoanPrice = loanPrice;
  const yearlyDeductionPrices = Array.from(new Array(applyYears)).map(() => {
    const yearlyDeductionPrice = Math.min(remainLoanPrice, limit) * rate;
    remainLoanPrice -= yearlyReturningPrice;
    return Math.round(yearlyDeductionPrice);
  });

  console.log({ yearlyDeductionPrices });

  const allDeductionPrice = yearlyDeductionPrices.reduce(
    (result, price) => result + price
  );

  return {
    allDeductionPrice,
  };
}

export function simulator({
  age,
  loanYears,
  loanPrice: loan,
  interestRate,
  bonusPrice: bonus,
  otherFee,
  salary,
  isTaxDeduction,
  isChildFutureAid,
}: Args): Result {
  const loanPrice = loan * 10000;
  console.log({ age, loanYears, loanPrice, interestRate, otherFee });

  const returningCount = loanYears * 12;
  const monthlyRate = interestRate / 100 / 12;
  // ボーナス支払額の総額(65歳定年の場合)
  const bonusPrice = bonus * 10000;
  const bonusAllReturnPrice = Math.min(bonusPrice * 2 * (65 - age), loanPrice);
  const loanAllPriceWithoutBonus = loanPrice - bonusAllReturnPrice;

  console.log({ returningCount, monthlyRate, loanAllPriceWithoutBonus });

  const onePlusMonthlyRateExpCount = (1 + monthlyRate) ** returningCount;

  const monthlyReturningPrice =
    (loanAllPriceWithoutBonus * monthlyRate * onePlusMonthlyRateExpCount) /
    (onePlusMonthlyRateExpCount - 1);
  const bonusMonthReturningPrice = monthlyReturningPrice + bonusPrice;
  console.log({ monthlyReturningPrice, bonusMonthReturningPrice });

  const yearlyReturningPrice = monthlyReturningPrice * 12;
  const allLoanPlusDebtPrice =
    yearlyReturningPrice * loanYears + bonusAllReturnPrice;

  console.log({ allLoanPlusDebtPrice });

  // 管理費は含める。ローン支払を終えれば monthlyReturningPrice は 0 になる
  const monthlyCost = monthlyReturningPrice + otherFee;
  const bonusMonthCost = bonusMonthReturningPrice + otherFee;

  // 人生100年時代なので100才まで払い続けると仮定する
  const monthsToLive = (100 - age) * 12;
  let allPayingCost = allLoanPlusDebtPrice + otherFee * monthsToLive;

  if (isChildFutureAid) {
    allPayingCost = allPayingCost - 100 * 10000;
  }

  // 住宅ローン減税を計算する場合
  if (isTaxDeduction) {
    // TODO type
    const { allDeductionPrice } = taxDeduction({
      loanPrice,
      loanYears,
      salary,
      monthlyReturningPrice,
      bonusMonthReturningPrice,
      type: "zeh",
    });
    const monthlyDeductionPrice = allDeductionPrice / (12 * loanYears);
    return {
      monthlyReturningPrice: Math.max(
        Math.round(monthlyReturningPrice - monthlyDeductionPrice),
        0
      ),
      bonusMonthReturningPrice: Math.max(
        Math.round(bonusMonthReturningPrice - monthlyDeductionPrice),
        0
      ),
      allLoanPlusDebtPrice: Math.round(
        allLoanPlusDebtPrice - allDeductionPrice
      ),
      monthlyCost: Math.max(Math.round(monthlyCost - monthlyDeductionPrice), 0),
      bonusMonthCost: Math.max(
        Math.round(bonusMonthCost - monthlyDeductionPrice),
        0
      ),
      allPayingCost: Math.round(allPayingCost - allDeductionPrice),
    };
  }

  return {
    monthlyReturningPrice: Math.round(monthlyReturningPrice),
    bonusMonthReturningPrice: Math.round(bonusMonthReturningPrice),
    allLoanPlusDebtPrice: Math.round(allLoanPlusDebtPrice),
    monthlyCost: Math.round(monthlyCost),
    bonusMonthCost: Math.round(bonusMonthCost),
    allPayingCost: Math.round(allPayingCost),
  };
}

export type ChildInfo = {
  // isPrivateSchool: {
  //   kindergarten: boolean;
  //   elementary: boolean;
  //   juniorHigh: boolean;
  //   high: boolean;
  //   university: boolean;
  // };
  isPrivateSchool: boolean;
  lessonsCost: string;
};

type Args = {
  monthlyRentPrice: number;
  age: number;
  salary: number;
  partnerSalary: number;
  partnerAge: number;
  livingExpenses: number;
  utilitiesCost: number;
  insurance: number;
  hobbyCost: number;
  entertainmentCost: number;
  otherCost: number;
  savingCost: number;
  savingCostRate: number;
  childrenInfo: ChildInfo[];
};

type Result = {
  // 毎月の平均支出額
  monthlyCost: number;
  // 毎月の平均収入額
  monthlyIncome: number;
  // 総支出額
  allPayingCost: number;
  // 総収入額
  allIncome: number;
  // 総貯蓄額
  allSavingCost: number;
  // 総収入額 - 総支出額
  allBalance: number;
};

export function lifeSimulator({
  monthlyRentPrice,
  age,
  salary: _salary,
  partnerSalary: _partnerSalary,
  partnerAge,
  livingExpenses,
  utilitiesCost,
  insurance,
  hobbyCost,
  entertainmentCost,
  otherCost,
  savingCost,
  savingCostRate,
  childrenInfo,
}: Args): Result {
  const salary = _salary * 10000;
  const partnerSalary = _partnerSalary * 10000;

  const remainWorkAge = 65 - age;
  const remainPartnerWorkAge = 65 - partnerAge;

  const mainIncome = salary * remainWorkAge;
  const partnerIncome = partnerSalary * remainPartnerWorkAge;
  const allIncome = mainIncome + partnerIncome;

  const monthlyIncome = Math.round((salary + partnerSalary) / 12);

  const oneChildAllCost = ChildGrowingCost.reduce(
    (result, item) => result + item * 10000,
    0
  );
  const addonAllPrivateSchoolCost = addonPrivateSchoolCost.reduce(
    (result, item) => result + item * 10000,
    0
  );
  console.log({ oneChildAllCost, addonAllPrivateSchoolCost });

  const allChildrenCost = childrenInfo.reduce<number>((result, item) => {
    return (
      result +
      oneChildAllCost +
      Number(item.lessonsCost) * 12 * 15 +
      (item.isPrivateSchool ? addonAllPrivateSchoolCost : 0)
    );
  }, 0);

  const monthlyChildCost = Math.round(allChildrenCost / (remainWorkAge * 12));
  console.log({ monthlyChildCost, allChildrenCost });

  const monthlyCost =
    monthlyRentPrice +
    livingExpenses +
    utilitiesCost +
    insurance +
    hobbyCost +
    entertainmentCost +
    otherCost +
    savingCost +
    monthlyChildCost;
  const yearlyCost = monthlyCost * 12;
  console.log({ yearlyCost, monthlyCost });

  const allPayingCost = yearlyCost * remainWorkAge;

  const allSavingCost =
    savingCost * 12 * remainWorkAge * (1 + savingCostRate / 100);

  const allBalance = allIncome - allPayingCost;

  return {
    monthlyCost,
    monthlyIncome,
    allPayingCost,
    allIncome,
    allSavingCost,
    allBalance,
  };
}

// 0歳から22歳までにかかると言われている養育費
const ChildGrowingCost = [
  93, 88, 94, 104, 120, 116, 121, 111, 106, 113, 115, 124, 127, 153, 153, 161,
  140, 140, 140, 100, 100, 100, 100,
];

// 私立に通う場合にかかる追加費用
const addonPrivateSchoolCost = [
  0, 30, 30, 30, 30, 30, 30, 120, 120, 120, 120, 120, 120, 100, 100, 100, 160,
  160, 160, 100, 100, 100, 100,
];

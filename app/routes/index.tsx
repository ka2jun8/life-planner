import { useState } from "react";
import { SimpleInput } from "~/components/Input";
import { SimpleRadio } from "~/components/Radio";
import { rentSimulator } from "~/lib/rentSimulator";
import { simulator } from "~/lib/simulator";

export default function Index() {
  // ローンシミュレーションに必要なインプット
  const [isRent, setIsRent] = useState<boolean>(true);

  // 賃貸する際の質問
  const [rentPrice, setRentPrice] = useState<string>("50000");
  const [condoFee, setCondoFee] = useState<string>("10000");
  const [renewalFee, setRenewalFee] = useState<string>("50000");

  // 購入する際の質問集
  const [isApartment, setIsApartment] = useState<boolean>(true);
  const [age, setAge] = useState<string>("30");
  const [housePrice, setHousePrice] = useState<string>("3000");
  const [loanPrice, setLoanPrice] = useState<string>("3000");
  const [loanYear, setLoanYear] = useState<string>("35");
  const [interestRate, setInterestRate] = useState<string>("1");
  const [salary, setSalary] = useState<string>("500");

  // マンションの場合は管理費や修繕積立費がかかる
  // TODO 修繕積立費が増えていくこともシミュレーションしたい
  const [managementFee, setManagementFee] = useState<string>("20000");

  // 結果
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [monthlyReturningPrice, setMonthlyReturningPrice] = useState<number>(0);
  const [monthlyCost, setMonthlyCost] = useState<number>(0);
  const [loanPlusDebtPrice, setLoanPlusDebtPrice] = useState<number>(0);
  const [allPayingCost, setAllPayingCost] = useState<number>(0);

  // 初期費用(TODO 7%掛けしていることを明記)
  const initialCost = Math.round(Number(loanPrice) * 0.07);
  // 頭金
  const downPayment = Number(housePrice) - Number(loanPrice);

  const calculateForRent = () => {
    const result = rentSimulator({
      age: Number(age),
      rentPrice: Number(rentPrice),
      condoFee: Number(condoFee),
      renewalFee: Number(renewalFee),
    });
    setIsSubmitted(true);
    setMonthlyCost(result.monthlyCost);
    setAllPayingCost(result.allPayingCost);
  };

  const calculate = () => {
    const result = simulator({
      age: Number(age),
      loanYears: Number(loanYear),
      loanPrice: Number(loanPrice),
      interestRate: Number(interestRate),
      otherFee: isApartment ? Number(managementFee) : 0,
      salary: Number(salary),
      isTaxDeduction: false, // TODO 選択式に変える
    });
    setIsSubmitted(true);
    setMonthlyReturningPrice(result.monthlyReturningPrice);
    setMonthlyCost(result.monthlyCost);
    setLoanPlusDebtPrice(result.loanPlusDebtPrice);
    setAllPayingCost(result.allPayingCost + initialCost * 10000);
  };

  return (
    <div className="prose lg:prose-xl">
      <h1>ローンシミュレータ</h1>
      <form>
        <SimpleRadio
          label="賃貸か購入か"
          value={isRent}
          items={["賃貸", "購入"]}
          onChange={(v) => {
            setIsSubmitted(false);
            setIsRent(v);
          }}
        ></SimpleRadio>
        {isRent && (
          <>
            <SimpleInput
              label="家賃(円/月額)"
              value={rentPrice}
              onChange={(v) => setRentPrice(v)}
            />
            <SimpleInput
              label="管理費・共益費(円/年)"
              value={condoFee}
              onChange={(v) => setCondoFee(v)}
            />
            <SimpleInput
              label="更新料(円)"
              value={renewalFee}
              onChange={(v) => setRenewalFee(v)}
            />
          </>
        )}
        {!isRent && (
          <>
            <SimpleRadio
              label="マンションか戸建てか"
              value={isApartment}
              items={["マンション", "戸建て"]}
              onChange={(v) => setIsApartment(v)}
            ></SimpleRadio>
            <SimpleInput
              label="物件価格"
              value={housePrice}
              onChange={(v) => setHousePrice(v)}
            />
            {isApartment && (
              <SimpleInput
                label="管理費/修繕積立費等"
                value={managementFee}
                onChange={(v) => setManagementFee(v)}
              />
            )}
            <SimpleInput
              label="借入額"
              value={loanPrice}
              onChange={(v) => setLoanPrice(v)}
            />
            <SimpleInput
              label="ローン年数"
              value={loanYear}
              onChange={(v) => setLoanYear(v)}
            />
            <span>頭金は {downPayment}万円 で計算します</span>
            <br />
            <span>初期費用は {initialCost}万円 で計算します</span>
            <SimpleInput
              label="金利(%)"
              value={interestRate}
              onChange={(v) => setInterestRate(v)}
            />
          </>
        )}
        <SimpleInput label="年齢" value={age} onChange={(v) => setAge(v)} />
        <SimpleInput
          label="年収"
          value={salary}
          onChange={(v) => setSalary(v)}
        />
        <button
          type="button"
          onClick={() => (isRent ? calculateForRent() : calculate())}
        >
          計算する
        </button>
      </form>

      {isSubmitted && (
        <>
          <div>毎月支払額{monthlyCost}</div>
          <div>毎月返済額{monthlyReturningPrice}</div>
          <div>総支払額{allPayingCost}</div>
          <div>総返済額{loanPlusDebtPrice}</div>
        </>
      )}
    </div>
  );
}

import { useState } from "react";
import { MetaFunction } from "remix";
import { SimpleInput } from "~/components/Input";
import { SimpleRadio } from "~/components/Radio";
import { rentSimulator } from "~/lib/rentSimulator";
import { simulator } from "~/lib/simulator";

const description = `住宅購入にかかる支払額のシミュレーションを行います。
実際には住宅ローンの返済に加えて、マンションの場合管理費がかかります。
また、住宅ローン減税が考慮される場合、実質的な額は利息分がまるまる支払うわけではありません。
賃貸と比較した場合にも、どちらの方が実費としてかかるのか比較検討できるようにします。
`;

export const meta: MetaFunction = () => {
  return {
    title: "住宅ローンシミュレーションツール",
    description,
    ["og:title"]: "住宅ローンシミュレーションツール",
    ["og:description"]: description,
    ["og:type"]: "website",
  };
};

export default function Index() {
  // ローンシミュレーションに必要なインプット
  const [isRent, setIsRent] = useState<boolean>(false);

  // 賃貸する際の質問
  const [rentPrice, setRentPrice] = useState<string>("50000");
  const [condoFee, setCondoFee] = useState<string>("10000");
  const [renewalFee, setRenewalFee] = useState<string>("50000");

  // 購入する際の質問集
  const [isApartment, setIsApartment] = useState<boolean>(true);
  const [housePrice, setHousePrice] = useState<string>("3000");
  const [loanPrice, setLoanPrice] = useState<string>("3000");
  const [loanYear, setLoanYear] = useState<string>("35");
  const [interestRate, setInterestRate] = useState<string>("1");
  const [isTaxDeduction, setIsTaxDeduction] = useState<boolean>(true);
  const [isChildFutureAid, setIsChildFutureAid] = useState<boolean>(false);
  const [bonusPrice, setBonusPrice] = useState<string>("0");

  // 共通の質問
  const [salary, setSalary] = useState<string>("500");
  const [age, setAge] = useState<string>("30");

  // マンションの場合は管理費や修繕積立費がかかる
  // TODO 修繕積立費が増えていくこともシミュレーションしたい
  const [managementFee, setManagementFee] = useState<string>("20000");

  // 戸建ての場合もメンテナンス費用がかかる。
  const [maintenanceCost, setMaintenanceCost] = useState<string>("500");

  // 結果
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [monthlyReturningPrice, setMonthlyReturningPrice] = useState<number>(0);
  const [bonusMonthReturningPrice, setBonusMonthReturningPrice] =
    useState<number>(0);
  const [monthlyCost, setMonthlyCost] = useState<number>(0);
  const [bonusMonthCost, setBonusMonthCost] = useState<number>(0);
  const [loanPlusDebtPrice, setLoanPlusDebtPrice] = useState<number>(0);
  const [allPayingCost, setAllPayingCost] = useState<number>(0);
  const [remainAssetPrice, setRemainAssetPrice] = useState<number>(0);

  // 初期費用
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
    setTimeout(() => {
      const el = document.documentElement;
      window.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 0);
  };

  const calculate = () => {
    const result = simulator({
      age: Number(age),
      loanYears: Number(loanYear),
      loanPrice: Number(loanPrice),
      interestRate: Number(interestRate),
      bonusPrice: Number(bonusPrice),
      otherFee: isApartment ? Number(managementFee) : 0,
      salary: Number(salary),
      isTaxDeduction,
      isChildFutureAid,
    });
    setIsSubmitted(true);
    setMonthlyReturningPrice(result.monthlyReturningPrice);
    setMonthlyCost(result.monthlyCost);
    setBonusMonthReturningPrice(result.bonusMonthReturningPrice);
    setBonusMonthCost(result.bonusMonthCost);
    setLoanPlusDebtPrice(result.allLoanPlusDebtPrice);
    setAllPayingCost(
      result.allPayingCost +
        initialCost * 10000 +
        Number(maintenanceCost) * 10000
    );
    // TODO 上物を 3454 万として土地の大体の価格を入れる
    // 建築費の平均をとっている
    setRemainAssetPrice(Math.max(Number(housePrice) - 3454, 0));
    setTimeout(() => {
      const el = document.documentElement;
      window.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 0);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="prose lg:prose-xl">
        <h1 className="p-2 text-xl text-gray-800 bg-red-100">
          住宅購入支払額シミュレーター
        </h1>
        <p className="text-sm p-2">{description}</p>
        <form className="flex flex-col p-2 space-y-4">
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
                label="家賃"
                value={rentPrice}
                unit="円/月"
                description="家賃は変動する可能性があります。築年数が上がって家賃が下がる可能性がありますが、逆に地価が値上がりして家賃が上がるケースもあります。シミュレーションする際は今よりも高めにしておくとリスクを低減できます。"
                onChange={(v) => {
                  setRentPrice(v);
                  setRenewalFee(v);
                }}
              />
              <SimpleInput
                label="管理費・共益費"
                value={condoFee}
                description="管理費・共益費は上がる可能性があります。築年数が上がることによってメンテナンスに費用がかかるケースが増えるためです。シミュレーションする際は今よりも高めにしておくとリスクを低減できます。"
                unit="円/月"
                onChange={(v) => setCondoFee(v)}
              />
              <SimpleInput
                label="更新料"
                value={renewalFee}
                unit="円/年"
                description="大体家賃1ヶ月分〜2ヶ月分がかかります。"
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
                description="マンションの場合、ランニングコストとして管理費や修繕積立費を考慮に入れる必要があります。戸建ての場合も修繕は必要になりますが、必須ではありません。"
                onChange={(v) => setIsApartment(v)}
              ></SimpleRadio>
              <SimpleInput
                label="物件価格"
                unit="万円"
                value={housePrice}
                onChange={(v) => {
                  setHousePrice(v);
                  setLoanPrice(v);
                }}
              />
              {isApartment && (
                <SimpleInput
                  label="管理費/修繕積立費等"
                  unit="円/月"
                  value={managementFee}
                  description="管理費/修繕積立費はほぼ確実に上がります。シミュレーションする際は高めに設定しておきましょう。駐車場等、他の設備も利用する場合はここに追加しておいてください。"
                  onChange={(v) => setManagementFee(v)}
                />
              )}
              {!isApartment && (
                <SimpleInput
                  label="メンテナンス費用"
                  value={maintenanceCost}
                  unit="万円"
                  description="戸建ての場合数年に一度メンテナンスが必要になる場合があります。死ぬまで、もしくは手放すまでの間に、どの程度修繕費用がかかるか考慮に入れておきましょう。"
                  onChange={(v) => setMaintenanceCost(v)}
                />
              )}
              <SimpleInput
                label="借入額"
                unit="万円"
                description="物件価格よりも高く設定するべきではありません。物件価格との差額が頭金になります。"
                value={loanPrice}
                onChange={(v) => setLoanPrice(v)}
              />
              <SimpleInput
                label="ローン年数"
                unit="年"
                value={loanYear}
                description="ローン年数は定年までの年数で終わらせる方が無難です。"
                onChange={(v) => setLoanYear(v)}
              />
              <SimpleInput
                label="ボーナス支払額"
                unit="万円"
                description="年2回のボーナス時にのみ追加で返済する額です。よっぽど安定的にボーナスが支払われる企業でない限り含めないことをおすすめします。65歳定年を想定しているため65歳までボーナスが支払われる想定です。ボーナスによる返済額を超さないようにしてください。"
                value={bonusPrice}
                onChange={(v) => setBonusPrice(v)}
              />
              <SimpleInput
                label="金利"
                unit="%"
                value={interestRate}
                description="金利は固定金利と変動金利があります。変動金利の方が安いかもしれませんが、あくまで変動なのでシミュレーションの際は固定金利でシミュレーションすることをおすすめします。"
                onChange={(v) => setInterestRate(v)}
              />
              <SimpleRadio
                label="住宅ローン減税を考慮に入れるか"
                value={isTaxDeduction}
                items={["入れる", "入れない"]}
                description="住宅ローン減税を考慮に入れることを選択した場合、減税額を計算に含めた上で支払額を算出します。そのため実際の支払・返済額ではなく実質支払額という形で表示されることに注意してください。住宅の種類によって額が異なりますが、一律ZEHタイプとして計算します。"
                onChange={(v) => setIsTaxDeduction(v)}
              ></SimpleRadio>
              <SimpleRadio
                label="こどもみらい支援を考慮に入れるか"
                value={isChildFutureAid}
                items={["入れる", "入れない"]}
                description="こどもみらい住宅支援事業の最大100万円の還付を総支払額に考慮する場合は選択してください(詳しくはこちらをご覧ください → https://kodomo-mirai.mlit.go.jp/about/)。還付額は一律100万円で計算します。"
                onChange={(v) => setIsChildFutureAid(v)}
              ></SimpleRadio>
            </>
          )}
          <SimpleInput
            label="年齢"
            unit="歳"
            value={age}
            description="年齢は、総支払額の計算に利用します。総支払額は、賃貸やマンション購入の場合ずっとかかり続けます。人生100年時代なので、100歳まで生きることを前提に計算します。"
            onChange={(v) => setAge(v)}
          />
          <SimpleInput
            label="年収"
            value={salary}
            unit="万円"
            description="年収は住宅ローン減税の対象範囲か判断するために利用します。"
            onChange={(v) => setSalary(v)}
          />
          {!isRent && (
            <p className="text-sm">
              頭金は {downPayment}万円 で計算します。
              <br />
              初期費用は {initialCost}万円 で計算します。 初期費用は 4〜5%
              と言われますが、実際にかかりうる額の最大額を出すために 7%
              掛けしています。
            </p>
          )}
          <button
            type="button"
            className="text-xl pl-6 pr-6 pt-2 pb-2 border-2 border-red-400 rounded-md text-red-400 font-bold"
            onClick={() => (isRent ? calculateForRent() : calculate())}
          >
            計算する
          </button>
        </form>

        {isSubmitted && (
          <section className="p-4 bg-red-50 flex flex-col items-end">
            <div className="space-x-2">
              <label>毎月支払額:</label>
              <span className="text-xl font-semibold">
                {monthlyCost.toLocaleString()}円
              </span>
            </div>
            {monthlyCost !== bonusMonthCost && (
              <div className="space-x-2">
                <label>ボーナス月支払額:</label>
                <span className="text-xl font-semibold">
                  {bonusMonthCost.toLocaleString()}円
                </span>
              </div>
            )}
            <div className="space-x-2">
              <label>毎月返済額:</label>
              <span className="text-xl font-semibold">
                {monthlyReturningPrice.toLocaleString()}円
              </span>
            </div>
            {monthlyReturningPrice !== bonusMonthReturningPrice && (
              <div className="space-x-2">
                <label>ボーナス月返済額:</label>
                <span className="text-xl font-semibold">
                  {bonusMonthReturningPrice.toLocaleString()}円
                </span>
              </div>
            )}
            <span>-----</span>
            <div className="space-x-2 flex">
              <label>総支払額:</label>
              <div className="flex flex-col items-end">
                <span className="text-xl font-semibold">
                  約 {Math.round(allPayingCost / 10000).toLocaleString()} 万円
                </span>
                <span className="text-xs">
                  ({allPayingCost.toLocaleString()}円)
                </span>
              </div>
            </div>
            <div className="space-x-2 flex">
              <label>総返済額:</label>
              <div className="flex flex-col items-end">
                <span className="text-xl font-semibold">
                  約 {Math.round(loanPlusDebtPrice / 10000).toLocaleString()}{" "}
                  万円
                </span>
                <span className="text-xs">
                  ({loanPlusDebtPrice.toLocaleString()}円)
                </span>
              </div>
            </div>
            <span>-----</span>
            <div className="space-x-2">
              <label>残る資産推定額:</label>
              <span className="text-xl font-semibold">
                約 {remainAssetPrice.toLocaleString()} 万円
              </span>
              <br />
              <p className="text-xs">
                残される土地の額を考慮します。上物を平均の建築額3454万円としたときの物件価格からの差額を算出します。地価が一定ではないため必ずしもこの額が資産として残るわけではありません。賃貸の場合は残らないので
                0 円になります。
              </p>
            </div>
          </section>
        )}
        <footer>
          <p className="text-xs m-2">
            Copyright © {new Date().getFullYear()},
            住宅ローンシミュレーションツール. All Right Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

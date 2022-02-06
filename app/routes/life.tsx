import { useState } from "react";
import { Link, MetaFunction } from "remix";
import { SimpleInput } from "~/components/Input";
import { SimpleRadio } from "~/components/Radio";
import { ChildInfo, lifeSimulator } from "~/lib/lifeSimulator";

const description = `人生にかかる支払額のシミュレーションを行います。
人生にかかる額は、不動産に支払う額、生活のレベル、子供の数、昇格昇給や転職、
預貯金がいくらありどのくらい投資がうまくいくかどうか、などによって変わります。
人生100年時代なので、100歳までの間にかかる額と残せる額をシミュレーションすることで、
ライフプランニングを考えてみましょう。`;

export const meta: MetaFunction = () => {
  return {
    title: "人生プランシミュレーションツール",
    description,
    ["og:title"]: "人生プランシミュレーションツール",
    ["og:description"]: description,
    ["og:type"]: "website",
  };
};

export default function LifeSimulationPage() {
  // TODO ほんとは前画面からもらってくる額
  const [monthlyRentPrice, setMonthlyRentPrice] = useState<string>("50000");
  const [salary, setSalary] = useState<string>("500");
  const [age, setAge] = useState<string>("30");

  const [isWorkingPartner, setIsWorkingPartner] = useState<boolean>(false);
  const [partnerSalary, setPartnerSalary] = useState<string>("500");
  const [partnerAge, setPartnerAge] = useState<string>("30");

  // 人生にかかる額
  const [livingExpenses, setLivingExpenses] = useState<string>("50000");
  const [utilitiesCost, setUtilitiesCost] = useState<string>("10000");
  const [insurance, setInsurance] = useState<string>("3000");
  const [hobbyCost, setHobbyCost] = useState<string>("20000");
  const [entertainmentCost, setEntertainmentCost] = useState<string>("10000");
  const [otherCost, setOtherCost] = useState<string>("30000");
  const [savingCost, setSavingCost] = useState<string>("30000");
  const [savingCostRate, setSavingCostRate] = useState<string>("1");

  // 子供関連
  const [childCount, setChildCount] = useState<string>("0");
  const [childrenInfo, setChildrenInfo] = useState<ChildInfo[]>([]);

  // 結果
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [monthlyCost, setMonthlyCost] = useState<number>(0);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [monthlyBalance, setMonthlyBalance] = useState<number>(0);
  const [allPayingCost, setAllPayingCost] = useState<number>(0);
  const [allIncome, setAllIncome] = useState<number>(0);
  const [allSavingCost, setAllSavingCost] = useState<number>(0);
  const [allBalance, setAllBalance] = useState<number>(0);

  const calculate = () => {
    const result = lifeSimulator({
      monthlyRentPrice: Number(monthlyRentPrice),
      age: Number(age),
      salary: Number(salary),
      partnerSalary: isWorkingPartner ? Number(partnerSalary) : 0,
      partnerAge: Number(partnerAge),
      livingExpenses: Number(livingExpenses),
      utilitiesCost: Number(utilitiesCost),
      insurance: Number(insurance),
      hobbyCost: Number(hobbyCost),
      entertainmentCost: Number(entertainmentCost),
      otherCost: Number(otherCost),
      savingCost: Number(savingCost),
      savingCostRate: Number(savingCostRate),
      childrenInfo,
    });
    setIsSubmitted(true);
    setMonthlyCost(result.monthlyCost);
    setMonthlyIncome(result.monthlyIncome);
    setMonthlyBalance(result.monthlyIncome - result.monthlyCost);
    setAllPayingCost(result.allPayingCost);
    setAllIncome(result.allIncome);
    setAllSavingCost(result.allSavingCost);
    setAllBalance(result.allBalance);
    setTimeout(() => {
      const el = document.documentElement;
      window.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 0);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="prose lg:prose-xl">
        <h1 className="p-2 text-xl text-gray-800 bg-red-100">
          ライフシミュレーター
        </h1>
        <p className="text-sm p-2">{description}</p>
        <form className="flex flex-col p-2 space-y-4">
          <SimpleInput
            label="年収"
            value={salary}
            unit="万円/月"
            description="手取り額を入れてください。年齢が65歳になるまでもらえる想定です。"
            onChange={(v) => {
              setSalary(v);
            }}
          />
          <SimpleInput
            label="年齢"
            value={age}
            unit="歳"
            description=""
            onChange={(v) => {
              setAge(v);
            }}
          />
          <SimpleRadio
            label="配偶者は働くか"
            value={isWorkingPartner}
            items={["働く", "働かない"]}
            onChange={(v) => {
              setIsWorkingPartner(v);
            }}
          />
          {isWorkingPartner && (
            <>
              <SimpleInput
                label="配偶者の年収"
                value={partnerSalary}
                unit="万円/月"
                description="年齢が65歳になるまでもらえる想定です。"
                onChange={(v) => {
                  setPartnerSalary(v);
                }}
              />
              <SimpleInput
                label="配偶者の年齢"
                value={partnerAge}
                unit="歳"
                onChange={(v) => {
                  setPartnerAge(v);
                }}
              />
            </>
          )}
          <div>-------</div>
          <SimpleInput
            label="家賃/住宅ローン返済額"
            value={monthlyRentPrice}
            unit="円/月"
            description="住宅ローンシミュレーションで算出した額を入れると良いです"
            onChange={(v) => {
              setMonthlyRentPrice(v);
            }}
          />
          <SimpleInput
            label="食費・生活費"
            value={livingExpenses}
            unit="円/月"
            description="生活するためにかかる費用を入れてください。将来子供が増えたときにかかる分も想定してください。"
            onChange={(v) => {
              setLivingExpenses(v);
            }}
          />
          <SimpleInput
            label="固定費"
            value={utilitiesCost}
            unit="円/月"
            description="光熱費、インターネット、スマホ代などを入れてください。"
            onChange={(v) => {
              setUtilitiesCost(v);
            }}
          />
          <SimpleInput
            label="保険"
            value={insurance}
            unit="円/月"
            description="毎月かかっている保険額を入れてください。積立型の場合は、貯蓄として貯蓄のフォームに入れてもらっても構いません。"
            onChange={(v) => {
              setInsurance(v);
            }}
          />
          <SimpleInput
            label="趣味・娯楽"
            value={hobbyCost}
            unit="円/月"
            description="家族が趣味・娯楽にかけるであろう月額を入れてください。"
            onChange={(v) => {
              setHobbyCost(v);
            }}
          />
          <SimpleInput
            label="交際費"
            value={entertainmentCost}
            unit="円/月"
            description="プレゼント代、冠婚葬祭、飲み会代などを含みます。"
            onChange={(v) => {
              setEntertainmentCost(v);
            }}
          />
          <SimpleInput
            label="その他"
            value={otherCost}
            unit="円/月"
            description="上記に含まれない支出があると思います。それ以外にこのくらいは支出するかもしれないという額を入れてください。"
            onChange={(v) => {
              setOtherCost(v);
            }}
          />
          <SimpleInput
            label="貯蓄"
            value={savingCost}
            unit="円/月"
            description="このくらい毎月貯めたいと思っている額を入れてください。"
            onChange={(v) => {
              setSavingCost(v);
            }}
          />
          <SimpleInput
            label="貯蓄の利率"
            value={savingCostRate}
            unit="%"
            description="貯蓄額を投資している場合想定する平均利率を入れてください。"
            onChange={(v) => {
              setSavingCostRate(v);
            }}
          />
          <SimpleInput
            label="子供の数"
            value={childCount}
            unit="人"
            description="将来的に欲しいお子さんの数を入れてください。"
            onChange={(v) => {
              setChildCount(v);
              const defaultChildInfo = {
                // isPrivateSchool: {
                //   kindergarten: false,
                //   elementary: false,
                //   juniorHigh: false,
                //   high: false,
                //   university: false,
                // },
                isPrivateSchool: false,
                lessonsCost: "0",
              };
              const nextChildCount = Number(v) || 0;
              setChildrenInfo(
                Array.from(new Array(nextChildCount)).map(
                  () => defaultChildInfo
                )
              );
            }}
          />
          {Array.from(new Array(Number(childCount) || 0)).map((_, i) => {
            const childInfo = childrenInfo[i];
            const _childrenInfo = [...childrenInfo];
            if (!childInfo) {
              return;
            }
            return (
              <div key={i}>
                <h3 className="p-2 text-lg text-gray-800 bg-red-100">
                  子供{i + 1}人目
                </h3>
                <SimpleRadio
                  label="通わせるのは私立か公立か"
                  value={childInfo.isPrivateSchool}
                  items={["私立", "公立"]}
                  onChange={(v) => {
                    childInfo.isPrivateSchool = v;
                    _childrenInfo[i] = childInfo;
                    setChildrenInfo(_childrenInfo);
                  }}
                />
                <SimpleInput
                  label="習い事にかける額"
                  value={childInfo.lessonsCost}
                  unit="円/月"
                  description="子供が習い事にいくとかかる額を入れてください。部活動も含みます。"
                  onChange={(v) => {
                    childInfo.lessonsCost = v;
                    _childrenInfo[i] = childInfo;
                    setChildrenInfo(_childrenInfo);
                  }}
                />
              </div>
            );
          })}
          <button
            type="button"
            className="text-xl pl-6 pr-6 pt-2 pb-2 border-2 border-red-400 rounded-md text-red-400 font-bold"
            onClick={calculate}
          >
            計算する
          </button>
        </form>

        {isSubmitted && (
          <section className="p-4 bg-red-50 flex flex-col items-end">
            <div className="space-x-2">
              <label>毎月の平均支出額:</label>
              <span className="text-xl font-semibold">
                {monthlyCost.toLocaleString()}円
              </span>
            </div>
            <div className="space-x-2">
              <label>毎月の平均収入額:</label>
              <span className="text-xl font-semibold">
                {monthlyIncome.toLocaleString()}円
              </span>
            </div>
            <div className="space-x-2">
              <label>毎月の平均収支額:</label>
              <span className="text-xl font-semibold">
                {monthlyBalance.toLocaleString()}円
              </span>
            </div>
            <span>----</span>
            <div className="space-x-2">
              <label>総支出額:</label>
              <span className="text-xl font-semibold">
                約 {calcBigPriceStr(allPayingCost)}
              </span>
              <span className="text-xs">
                ({allPayingCost.toLocaleString()}円)
              </span>
            </div>
            <div className="space-x-2">
              <label>総収入額:</label>
              <span className="text-xl font-semibold">
                約 {calcBigPriceStr(allIncome)}
              </span>
              <span className="text-xs">({allIncome.toLocaleString()}円)</span>
            </div>
            <div className="space-x-2">
              <label>総貯蓄額:</label>
              <span className="text-xl font-semibold">
                約 {calcBigPriceStr(allSavingCost)}
              </span>
              <span className="text-xs">
                ({allSavingCost.toLocaleString()}円)
              </span>
            </div>
            <div className="space-x-2">
              <label>総収支:</label>
              <span className="text-xl font-semibold">
                約 {calcBigPriceStr(allBalance)}
              </span>
              <span className="text-xs">({allBalance.toLocaleString()}円)</span>
            </div>
          </section>
        )}
        <Link className="ml-2" to="/">
          住宅ローンシミュレーションへ
        </Link>
      </div>
    </div>
  );
}

function calcBigPriceStr(price: number) {
  return Math.abs(price) > 100000000
    ? `${(Math.round(price / (10000 * 1000)) / 10).toLocaleString()} 億円`
    : `${Math.round(price / 10000).toLocaleString()} 万円`;
}

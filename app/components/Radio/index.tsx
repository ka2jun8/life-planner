import { useState } from "react";

type Props = {
  label: string;
  items: [string, string];
  value: boolean;
  description?: string;
  onChange: (v: boolean) => void;
};

export const SimpleRadio: React.VFC<Props> = ({
  label,
  items,
  description,
  value,
  onChange,
}) => {
  const buttonStyle = "mt-1 border border-solid p-2 text-xl font-semibold w-32";
  const [isShowDetail, showDetail] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      <div>
        <label className="font-semibold text-lg">{label}</label>
        {description && (
          <span
            className="ml-1 border-2 rounded-full border-red-50 text-sm w-4 bg-red-50 text-red-300 pr-1 pl-1"
            onClick={() => showDetail(!isShowDetail)}
            onMouseEnter={() => showDetail(true)}
            onMouseLeave={() => showDetail(false)}
          >
            ?
          </span>
        )}
      </div>
      {isShowDetail && (
        <p className="text-xs p-3 bg-gray-50 rounded-xl m-0">{description}</p>
      )}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          className={
            value
              ? `${buttonStyle} border-red-400 bg-red-50`
              : `${buttonStyle} border-gray-700 bg-gray-100 `
          }
          onClick={() => onChange(true)}
        >
          {items[0]}
        </button>
        <button
          type="button"
          className={
            !value
              ? `${buttonStyle} border-red-400 bg-red-50`
              : `${buttonStyle} border-gray-700 bg-gray-100 `
          }
          onClick={() => onChange(false)}
        >
          {items[1]}
        </button>
      </div>
    </div>
  );
};

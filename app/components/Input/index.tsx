import { useState } from "react";

type Props = {
  className?: string;
  label: string;
  description?: string;
  value: string;
  unit?: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export const SimpleInput: React.VFC<Props> = ({
  className,
  label,
  description,
  value,
  unit = "円",
  placeholder,
  onChange,
}) => {
  const style = "flex flex-col";
  const [isShowDetail, showDetail] = useState<boolean>(false);

  return (
    <div className={className ? `${style} ${className}` : style}>
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
      <div className="flex flex-row items-end justify-end">
        <input
          className="mt-1 border-b border-solid p-2 border-gray-700 bg-gray-100 text-2xl font-semibold w-32"
          type="number"
          placeholder={placeholder}
          value={value}
          pattern="[0-9]*"
          onChange={(e) => onChange(e.target.value)}
        />
        {unit && (
          <span className="font-semibold pl-2 w-16 text-center">{unit}</span>
        )}
      </div>
    </div>
  );
};

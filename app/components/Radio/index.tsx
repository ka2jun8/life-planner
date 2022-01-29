type Props = {
  label: string;
  items: [string, string];
  value: boolean;
  onChange: (v: boolean) => void;
};

export const SimpleRadio: React.VFC<Props> = ({
  label,
  items,
  value,
  onChange,
}) => {
  return (
    <div>
      <label>{label}</label>
      <button
        type="button"
        className={
          value ? "border border-solid border-purple" : "border border-solid"
        }
        onClick={() => onChange(true)}
      >
        {items[0]}
      </button>
      <button
        type="button"
        value="戸建て"
        className={
          !value ? "border border-solid border-purple" : "border border-solid"
        }
        onClick={() => onChange(false)}
      >
        {items[1]}
      </button>
    </div>
  );
};

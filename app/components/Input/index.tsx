type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const SimpleInput: React.VFC<Props> = ({ label, value, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        onChange={(e) => onChange(e.target.value)}
        className="border border-solid border-red-100"
        type="text"
        value={value}
      />
    </div>
  );
};

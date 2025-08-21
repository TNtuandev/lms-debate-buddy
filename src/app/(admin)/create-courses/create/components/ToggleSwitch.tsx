interface ToggleSwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  color?: "blue" | "green" | "yellow" | "gray";
}

export default function ToggleSwitch({ 
  value, 
  onChange, 
  color = "blue" 
}: ToggleSwitchProps) {
  const colorClasses = {
    blue: value ? "bg-blue-500" : "bg-gray-300",
    green: value ? "bg-green-500" : "bg-gray-300",
    yellow: value ? "bg-yellow-500" : "bg-gray-300",
    gray: value ? "bg-gray-500" : "bg-gray-300",
  };

  return (
    <div
      style={{marginBlockEnd: 0, marginBlockStart: 0}}
      className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${colorClasses[color]}`}
      onClick={() => onChange(!value)}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </div>
  );
} 
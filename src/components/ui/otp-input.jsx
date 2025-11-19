import { useRef, useEffect } from "react";

const OTPInput = ({ length = 6, value, onChange, error }) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const val = e.target.value;

    // Only allow numbers
    if (val && !/^\d+$/.test(val)) return;

    const newOTP = value.split("");
    newOTP[index] = val.slice(-1); // Only take last character
    const newValue = newOTP.join("");
    onChange(newValue);

    // Move to next input if value is entered
    if (val && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, length);

    // Only allow numbers
    if (!/^\d+$/.test(pastedData)) return;

    onChange(pastedData);

    // Focus on the next empty input or last input
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex].focus();
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-12 h-14 text-center text-2xl font-semibold bg-white text-gray-900 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-brand-green focus:ring-brand-green/20"
            }`}
          />
        ))}
      </div>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default OTPInput;

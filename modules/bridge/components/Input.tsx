import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils.js";
import React, { useEffect, useState } from "react";

export default function Input({
  value,
  onChange,
}: {
  value: BigNumber;
  onChange: (val: BigNumber) => void;
}): React.ReactElement {
  // The input value should be able to be changed by the user in any way, and only trigger the change when the units are correct.
  const [inputValue, setInputValue] = useState(formatUnits(value));

  const [errorInvalidFormat, setErrorInvalidFormat] = useState(false);

  const getBigNumberFromInputString = (val: string): BigNumber => {
    let formattedVal = parseFloat(val.replaceAll(",", "."));
    const newValue = BigNumber.from(
      val ? parseUnits(formattedVal.toString()) : "0"
    );
    return newValue;
  };

  const updateValue = (val: string) => {
    setInputValue(val);

    try {
      // Use bignumber to validate the number
      const newValue = getBigNumberFromInputString(val);

      if (newValue.lt(0)) {
        throw new Error("Invalid");
      }

      setErrorInvalidFormat(false);

      onChange(newValue);
    } catch (e) {
      setErrorInvalidFormat(true);
      onChange(parseUnits("0"));
      return;
    }
  };

  useEffect(() => {
    const valueDiffers = !getBigNumberFromInputString(inputValue).eq(value);
    if (valueDiffers) {
      setInputValue(formatUnits(value));
    }
  }, [value]);
  return (
    <React.Fragment>
      <input
        className={errorInvalidFormat ? "error" : ""}
        type="number"
        step={"any"}
        value={inputValue}
        placeholder="0.0 DAI"
        onChange={(e) => updateValue(e.target.value)}
      />
      <style jsx>{`
        .error {
          border: 1px solid red;
        }
        
      `}</style>
    </React.Fragment>
  );
}

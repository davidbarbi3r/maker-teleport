import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

export const formatDai = (amount: BigNumber):string => {
    const cropedAmount = formatUnits(amount, "ether").slice(0, 4)
    return cropedAmount
}


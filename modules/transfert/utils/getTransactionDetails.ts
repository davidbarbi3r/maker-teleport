export const getTransactionDetails = (txHash: string, chain?: string) => {
    return `https://optimistic.etherscan.io/tx/${txHash}`
}
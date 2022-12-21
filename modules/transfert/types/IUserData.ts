import { ITeleportData } from "./ITeleportData"

export interface IUserData {
    id: string
    amountBridged: string
    countBridged: string
    destinyChain: string
    originChain: string
    teleport : ITeleportData[]
}


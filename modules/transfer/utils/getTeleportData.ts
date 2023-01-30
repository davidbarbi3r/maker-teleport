import axios from "axios";
import { IUserData } from "../types/IUserData";

const graphEndpoint = {
    optimism: "https://api.thegraph.com/subgraphs/name/davidbarbi3r/teleport-dai-optimism",
    arbitrum: ""
}

export const getOptimismTeleportData = async (
    address?: string,
    start = 0,
    limit = 10,
): Promise<IUserData[]> => {

    const data = await axios.post(graphEndpoint.optimism, {
            query: `
            query UsersQuery{
                users {
                    id
                    amountBridged
                    countBridged
                    teleport {
                        id
                        date
                        amount
                    }
                }
            } `
        }).then(res => res.data)

    const result: IUserData[] = data.data.users.map((user: any) => {return {
        ...user,
        originChain: "optimism",
        destinyChain: "mainnet",
    }})

    return result
};


// 

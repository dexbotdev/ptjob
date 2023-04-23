 import chains from "./constants.js";
 
 const getScanLink = (networkname, tnxHash) => {


    switch (networkname) {

        case "Fantom":
            return `https://ftmscan.com/tx/${tnxHash}`;
        case "Ethereum":
            return `https://etherscan.io/tx/${tnxHash}`;
        case "Binance":
            return `https://bscscan.com/tx/${tnxHash}`;
        case "Avalanche":
            return `https://snowtrace.io/tx/${tnxHash}`;
        case "Polygon":
            return `https://polygonscan.com/tx/${tnxHash}`;
        default :
        return `https://ftmscan.com/tx/${tnxHash}`;

    }

}

export const getChainId=(chainName)=>{ 
    const chainRecord = chains.find((chain) => chain.name === chainName); 
    return chainRecord.chain_id; 
}

export default getScanLink;
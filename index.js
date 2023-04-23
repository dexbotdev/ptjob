import Parse from 'parse/node.js';
import axios from 'axios'
import { getChainId } from './getScanLink.js';

Parse.initialize("qZkw0r3HP50ZpZMAPO1iq2L9RMyhoDmwKhGkYD6K", "ju0i3X5m41RJjZgM2GKf1QB4XWD80BOm8xI1mVoP");
Parse.serverURL = "https://parseapi.back4app.com/"; 
const MyTrades = Parse.Object.extend("MyTrades");

const getQuoteForToken = async(chainName,tokenAddress)=>{

    const chainId = getChainId(chainName);
    console.log(chainName);
    console.log(tokenAddress);
    
    const pricedata1 = await axios.get(`https://api.dev.dex.guru/v1/chain/56/tokens/market?token_addresses=${tokenAddress}&sort_by=timestamp&order=desc&limit=10&offset=0&api-key=Vg71e4buhUc2uhHpejohD6VTgxMnAyARNc9WkMoWzpQ`)
    const pricedata = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chainName}/${tokenAddress}`)

    console.log(pricedata.data);

    return pricedata.data.pair.priceUsd;
}

const runJob = async()=>{

    const query = new Parse.Query(MyTrades);
    const results = await query.findAll();
    const trades=[];
    for (let i = 0; i < results.length; i++) {
      const pairConfig = results[i]; 
      console.log(pairConfig.id)

      const pairAddress = pairConfig.get('pairAddress')
      const chainName = pairConfig.get('networkName')
        const priceUsd = await getQuoteForToken(chainName,pairAddress); 
        const tradeUpdate = new MyTrades();
      tradeUpdate.set("objectId", pairConfig.id); 
      tradeUpdate.set('quote', priceUsd); 
      tradeUpdate.save();  
    }
 
    
}


runJob();
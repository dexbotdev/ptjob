import Parse from 'parse/node.js';
import axios from 'axios'
import { getChainId } from './getScanLink.js';
import cron from 'node-cron'

Parse.initialize("qZkw0r3HP50ZpZMAPO1iq2L9RMyhoDmwKhGkYD6K", "ju0i3X5m41RJjZgM2GKf1QB4XWD80BOm8xI1mVoP");
Parse.serverURL = "https://parseapi.back4app.com/"; 
const MyTrades = Parse.Object.extend("MyTrades");

const getQuoteForToken = async(chainName,pairAddress)=>{

    const chainId = getChainId(chainName);
    console.log(chainName);
    console.log(pairAddress); 
    const pricedata = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chainName}/${pairAddress}`)

 
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



cron.schedule('* * * * *', () => {
    console.log('running getQuoteForToken every pairAddress');
    runJob();

  });
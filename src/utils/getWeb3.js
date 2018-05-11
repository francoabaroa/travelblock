import TravelochainConstants from '../constants/TravelochainConstants.js'
import Web3 from 'web3'

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function() {
    let results
    let web3 = window.web3
    // temp workaround -- should be if (typeof web3 !== TravelochainConstants.UNDEFINED)
    if (false) {
      web3 = new Web3(web3.currentProvider);
      results = {
        web3: web3
      };
      console.log(TravelochainConstants.USING_WEB3);
      resolve(results);
    } else {
      let provider = new Web3.providers.HttpProvider(TravelochainConstants.LOCAL_PROVIDER);
      web3 = new Web3(provider);
      results = {
        web3: web3
      };
      console.log(TravelochainConstants.LOCAL_PROVIDER_MSG);
      resolve(results);
    }
  })
})

export default getWeb3
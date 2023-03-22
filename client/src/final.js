// import React, { useEffect, useState } from 'react';
// import Web3 from 'web3';
// import TokenFarm from './utils/TokenFarm.json';
// import Stakers from './Stakers';
// import StakeInfo from './StakeInfo';

// function App() {
//   const [stakers, setStakers] = useState([]);
//   const [stakeInfo, setStakeInfo] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       //Connect to the Ethereum network using Web3.js
//       const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

//       //Retrieve the necessary data from the TokenFarm contract
//       const networkId = await web3.eth.net.getId();
//       const tokenFarm = new web3.eth.Contract(TokenFarm.abi, TokenFarm.networks[networkId].address);
//       const stakers = await tokenFarm.methods.getStakers().call();
//       const stakeInfo = await tokenFarm.methods.stakeInfo("0x5bea25d2B588E245d2539c29E3049B5b01161902").call();

//       // Set the data to the state variables
//       setStakers(stakers);
//       setStakeInfo(stakeInfo);
      
//     }
//     console.log(stakers)
//     fetchData();
//   }, []);

//   return (
//     <div className="App">
//       <h1>Stakers:</h1>
//       <Stakers stakers={stakers} />
//       <h1>Stake Information:</h1>
//       <StakeInfo stakeInfo={stakeInfo} />
//     </div>
//   );
// }

// export default App;

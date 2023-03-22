// import React, { useEffect, useState } from "react";
// import { Table } from "react-bootstrap";
// import Web3 from "web3";
// import TokenFarm from "./utils/TokenFarm.json";

// export function Stakers() {

//     const [stakeEvents, setStakeEvents] = useState([]);

//     useEffect(() => {
//         async function fetchData(){
//           const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

//         // Retrieve the necessary data from the TokenFarm contract
//         const networkId = await web3.eth.net.getId();
//         const tokenfarm = new web3.eth.Contract(TokenFarm.abi, TokenFarm.networks[networkId].address);

//         const loadStakeEvents = async () => {
//             const events = await tokenfarm.getPastEvents("Staked", { fromBlock: 0 });
//             const stakeEvents = events.map((event) => ({
//                 staker: event.returnValues.staker,
//                 amount: event.returnValues.amount,
//                 timestamp: event.returnValues.timestamp,
//             }));
//             setStakeEvents(stakeEvents);
//             console.log(stakeEvents)
//         };

//         loadStakeEvents();
    
//         // listen for new stake events
//         const eventEmitter = tokenfarm.events.Staked();
//         eventEmitter.on("data", (event) => {
//             const newStakeEvent = {
//                 staker: event.returnValues.staker,
//                 amount: event.returnValues.amount,
//                 timestamp: event.returnValues.timestamp,
//             };
//             setStakeEvents([...stakeEvents, newStakeEvent]);
//         });
//         return () => {
//             eventEmitter.removeAllListeners();
//         };}
//         fetchData();
//     }, []);

//     return (
//         <div>
//             <h1>Stake Events</h1>
//             <Table>
//                 <thead>
//                     <tr>
//                         <th>Staker</th>
//                         <th>Amount</th>
//                         <th>Timestamp</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {stakeEvents.map((event, index) => (
//                         <tr key={index}>
//                             <td>{event.staker}</td>
//                             <td>{event.amount}</td>
//                             <td>{new Date(event.timestamp * 1000).toString()}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//         </div>
//     );
// }

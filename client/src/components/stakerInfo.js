import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import TokenFarm from "../utils/TokenFarm.json";
import Web3 from "web3";

function StakerInfo() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [tokenFarm, setTokenFarm] = useState(null);
  const [stakers, setStakers] = useState([]);
  const [stakerInfo, setStakerInfo] = useState([]);

  useEffect(() => {
    const init = async () => {
      // Get network provider and web3 instance.
      const web3 =  new Web3(window.web3.currentProvider);
      setWeb3(web3);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TokenFarm.networks[networkId];
      const instance = new web3.eth.Contract(
        TokenFarm.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setTokenFarm(instance);

      // Get stakers information.
      const stakers = await instance.methods.getStakers().call();
      setStakers(stakers);
      console.log(stakers)
      

      // Get staker information by passing the address of the staker.
      const stakerInfoPromises = stakers.map(async (staker) => {
        const {balance, isStaking} = await instance.methods.getStakerInfo(staker).call();
        

        return {
          address: staker,
          balance: balance,
          isStaking: isStaking,
        };
      });
      const stakerInfo = await Promise.all(stakerInfoPromises);
      setStakerInfo(stakerInfo);
    };
    init();
  }, []);

  return (
    <div>
      <h1>Stakers</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Address</th>
            <th>Staking Balance</th>
            <th>Staking Status</th>
          </tr>
        </thead>
        <tbody>
          {stakerInfo.map((staker) => (
            <tr key={staker.address}>
              <td>{staker.address}</td>
              {/* <td>{web3.utils.fromWei(staker.state.balance.toString(), 'ether')} CRED</td> */}
              <td>{staker.isStaking ? 'Staking' : 'Not Staking'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default StakerInfo;

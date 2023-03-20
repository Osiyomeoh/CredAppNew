import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;



export const TransactionProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

 
  const checkIfWalletIsConnect = async () => {
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });
  
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        // getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
    }
  };
  const disconnectWallet = async () => {
    try {
      // if (!ethereum) return alert("Please install MetaMask.");
  
      await ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
  
      ethereum.off("accountsChanged", handleAccountsChanged);
      setCurrentAccount("");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setCurrentAccount("");
    } else {
      setCurrentAccount(accounts[0]);
    }
  };
  
  
  

  useEffect(() => {
    checkIfWalletIsConnect();
    // checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        disconnectWallet,
        transactions,
        currentAccount,
        isLoading,
       
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
import React, { useEffect, useState } from "react";

// Create a new context object for transactions
export const TransactionContext = React.createContext();

// Destructure the ethereum object from the global window object
const { ethereum } = window;

// Define a new component for the transaction provider
export const TransactionProvider = ({ children }) => {
  
  // Set up state to hold the current account
  const [currentAccount, setCurrentAccount] = useState("");
  
  // Define a function to check if the user has connected their wallet
  const checkIfWalletIsConnect = async () => {
    try {
      // Call the `eth_accounts` method on the ethereum object to get the user's accounts
      const accounts = await ethereum.request({ method: "eth_accounts" });
  
      // If the user has at least one account, set the current account state
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
       
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  // Define a function to connect the user's wallet
  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Please install MetaMask.");
        return;
      }
  
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  
      setCurrentAccount(accounts[0]);
  
      alert("Wallet connected successfully!");
      console.log("Wallet connected successfully!");
  
      window.location.reload();
    } catch (error) {
      console.error(error);
  
      alert("There was an error connecting your wallet.");
      console.log("Error connecting wallet:", error);
    }
  };
  
  
  // Define a function to disconnect the user's wallet
  const disconnectWallet = async () => {
    try {
      // Call the `wallet_requestPermissions` method on the ethereum object to request permission to access the user's accounts
      await ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
  
      // Remove the event listener for account changes
      ethereum.off("accountsChanged", handleAccountsChanged);
      // Clear the current account state
      setCurrentAccount("");
      // Reload the page to reflect the updated account information
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  
  // Define a function to handle changes in the user's accounts
  const handleAccountsChanged = (accounts) => {
    // If the user no longer has any accounts, clear the current account state
    if (accounts.length === 0) {
      setCurrentAccount("");
    } else {
      // Otherwise, set the current account state to the first account returned by the method
      setCurrentAccount(accounts[0]);
    }
  };
  
  // Set up an effect to check if the user has connected their wallet
  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  // Render the TransactionContext provider component with the appropriate values
  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
        currentAccount,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

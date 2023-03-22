import React, { Component } from "react";
import Main from "./main.js";
import { Table } from "react-bootstrap";
import { Stakers } from "./Stakers.1";
// import StakerInfo from "./components/stakerInfo";
import Footer from "./components/Footer";
import Connect from "./components/connect";
import Spinner from "./components/Spinner/Spinner.js";
import Web3 from "web3";
import Gains from "./utils/Gains.json";
import CredToken from "./utils/CredToken.json";
import TokenFarm from "./utils/TokenFarm.json";
import ParticleSettings from "./components/ParticleSettings.js";
import { Signer } from "crypto";
import { TransactionProvider } from "./context/TransactionContext.jsx";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  withRouter,
  BrowserRouter
} from "react-router-dom";

class App extends Component {
  
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  async loadWeb3() {
    
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      //await ethereum.send('eth_requestAccounts');
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }
  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();

  
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();

    //Load Cred Token.
    const credtokenData = CredToken.networks[networkId];
    if (credtokenData) {
      const credtoken = new web3.eth.Contract(
        CredToken.abi,
        credtokenData.address
      );
      this.setState({ credtoken });
      let credtokenBalance = await credtoken.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ credtokenBalance: credtokenBalance.toString() });
    } else {
      window.alert(
        "CredToken contract not deployed to current network. Please switch to a compatible network."
      );
    }

    //Load Gains token.
    const gainsTokenData = Gains.networks[networkId];
    if (gainsTokenData) {
      const gains = new web3.eth.Contract(Gains.abi, gainsTokenData.address);
      this.setState({ gains });
      let gainsTokenBalance = await gains.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ gainsTokenBalance: gainsTokenBalance.toString() });
    } else {
      window.alert(
        "Gains Token contract not deployed to current network. Please switch to a compatible network."
      );
    }

    //Load TokenFarm contract.
    const tokenfarmData = TokenFarm.networks[networkId];
if (tokenfarmData) {
  const tokenfarm = new web3.eth.Contract(
    TokenFarm.abi,
    tokenfarmData.address
  );
  this.setState({ tokenfarm });
        let stakingBalance = await tokenfarm.methods
        .stakingBalance(this.state.account)
        .call();
      this.setState({ stakingBalance: stakingBalance.toString() });

  const loadStakeEvents = async () => {
    try {
      const events = await tokenfarm.getPastEvents("Staked", { fromBlock: 0 });
      const stakeEvents = events.map((event) => ({
        staker: event.returnValues.staker,
        amount: event.returnValues.amount,
        timestamp: event.returnValues.timestamp,
      }));
      this.setState({ stakeEvents });
      console.log(stakeEvents);
    } catch (error) {
      console.log(error);
    }
  };

  loadStakeEvents();

  const eventEmitter = tokenfarm.events.Staked();
  eventEmitter.on("data", (event) => {
    const newStakeEvent = {
      staker: event.returnValues.staker,
      amount: event.returnValues.amount,
      timestamp: event.returnValues.timestamp,
    };
    this.setState({
      stakeEvents: [...this.state.stakeEvents, newStakeEvent],
    });
  });
  eventEmitter.removeAllListeners();
  // return () => {
  //    eventEmitter.removeAllListeners();
  // };
} else {
  window.alert(
    "TokenFarm not deployed to current network. Please switch to a compatible network."
  );
}

this.setState({ loading: false });
  }
  isConnected = async () => Signer !== undefined;
  connectWallet = async () => {
    if (window.ethereum) {
      //check if Metamask is installed
      try {
        const address = await window.ethereum.enable(); //connect Metamask
        const obj = {
          connectedStatus: true,
          status: "",
          address: address,
        };
        return obj;
      } catch (error) {
        return {
          connectedStatus: false,
          status: "🦊 Connect to Metamask using the button on the top right.",
        };
      }
    } else {
      return {
        connectedStatus: false,
        status:
          "🦊 You must install Metamask into your browser: https://metamask.io/download.html",
      };
    }
  };
  
  
  stakeTokens = (amount) => {
    this.setState({ loading: true });
    this.state.credtoken.methods
      .approve(this.state.tokenfarm._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.tokenfarm.methods
          .depositTokens(amount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
            window.location.reload();
          });
      });
  };
 
  unstakeTokens = () => {
    this.setState({ loading: true });
    this.state.tokenfarm.methods
      .unstakeTokens()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  issueTokens = () => {
    this.setState({ loading: true });
    this.state.tokenfarm.methods
      .issueTokens()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  claimTokens = () => {
    this.setState({ loading: true });
    this.state.tokenfarm.methods
      .claimTokens()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };


  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      credtoken: {},
      gains: {},
      tokenfarm: {},
      stakeEvents:[],
      credtokenBalance: "0",
      gainsTokenBalance: "0",
      stakingBalance: "0",
      loading: true,
    };
  }

  render() {
    let content;
    this.state.loading
      ? (content = (
          <div>
            <div
              class="card mt-5 text-center"
              style={{
                borderRadius: ".5rem",
                border: "1px solid transparent",
                backgroundColor: "rgba(137, 145, 211, .7)",
                backdropFilter: "blur(0.2rem)",
                boxShadow: "1.3rem 1.3rem 1.3rem rgba(0, 0, 0, 0.1)",
                borderTopColor: "rgba(225, 225, 225, 0.5)",
                borderLeftColor: "rgba(225, 225, 225, 0.5)",
                borderBottomColor: "rgba(225, 225, 225, 0.1)",
                borderRightColor: "rgba(225, 225, 225, 0.1)",
              }}
            ></div>
            <p style={{ color: "white", margin: "32%", padding: "14%" }}>
              <Spinner />
            </p>
          </div>
        ))
      : (content = (
          <Main
            credtokenBalance={this.state.credtokenBalance}
            gainsTokenBalance={this.state.gainsTokenBalance}
            stakeTokens={this.stakeTokens}
            unstakeTokens={this.unstakeTokens}
            tokenfarmContract={this.tokenfarm}
            issueTokens={this.issueTokens}
            connectWallet={this.connectWallet}
            claimTokens={this.claimTokens}
            stakingBalance={this.state.stakingBalance}
            stakers={this.stakers}
            account={this.state.account}
            stakeEvents={this.state.stakeEvents}
           
          />
        ));

    return (
      <div className="App" style={{ position: "relative" }}>
        <div style={{ position: "absolute" }}>
          <ParticleSettings />
        </div>
        <TransactionProvider>
          <Connect />
        </TransactionProvider>
        {/* <Navbar account={this.state.account}
      connectWallet={this.connectWallet}
      isConnected={this.isConnected} /> */}
       <div className="container-fluid mt-5">
  <div className="row">
    <main
      role="main"
      className="col-lg-5 col-md-8 col-sm-10 ml-auto mr-auto"
      style={{ maxWidth: "100%", minHeight: "100vh" }}
    >
      <div>{content}</div>
    </main>
  </div>


        

          <Footer />
        </div>
      </div>
    );
  }
}

export default App;

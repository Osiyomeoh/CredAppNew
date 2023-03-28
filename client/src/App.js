//Importing required libraries and components
import React, { Component } from "react";
import Main from "./main.js";
import Footer from "./components/Footer";
import Connect from "./components/connect";
import Spinner from "./components/Spinner/Spinner.js";
import Web3 from "web3";
import Gains from "./utils/Gains.json";
import CredToken from "./utils/CredToken.json";
import TokenFarm from "./utils/TokenFarm.json";
import ParticleSettings from "./components/ParticleSettings.js";
import { TransactionProvider } from "./context/TransactionContext.jsx";

//Defining the App component
class App extends Component {
  //Function called before rendering, loads the Web3 instance and blockchain data
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  //Loads the Web3 instance
  async loadWeb3() {
    //Check if the browser has an Ethereum wallet (e.g. Metamask) installed
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

  //Loads the blockchain data, including contracts and account balance
  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    //Set the first account as the user's account
    this.setState({ account: accounts[0] });

    //Get the network ID of the current network
    const networkId = await web3.eth.net.getId();

    //Load Cred Token
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

    //Load Gains token
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

      // Load staking balance
      let stakingBalance = await tokenfarm.methods
        .stakingBalance(this.state.account)
        .call();
      this.setState({ stakingBalance: stakingBalance.toString() });

      // Load staking events
      const loadStakeEvents = async () => {
        try {
          const events = await tokenfarm.getPastEvents("Staked", {
            fromBlock: 0,
          });
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

      // Listen for new stake events
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

      const TokensIssue = async () => {
        try {
          const newws = await tokenfarm.getPastEvents("TokensIssued", {
            fromBlock: 0,
          });
          const TstakeEvents = newws.map((neww) => ({
            recipient: neww.returnValues.staker,
            amount: neww.returnValues.amount,
            timestamp: neww.returnValues.timestamp,
          }));
          this.setState({ TstakeEvents });
          console.log(TstakeEvents);
        } catch (error) {
          console.log(error);
        }
      };

      TokensIssue();

      //Listen for new stake events
      const TeventEmitter = tokenfarm.events.TokensIssued();
      TeventEmitter.on("data", (neww) => {
        const newTStakeEvent = {
          recipient: neww.returnValues.staker,
          amount: neww.returnValues.amount,
          timestamp: neww.returnValues.timestamp,
        };
        this.setState({
          TstakeEvents: [...this.state.TstakeEvents, newTStakeEvent],
        });
      });
      eventEmitter.removeAllListeners();
    } else {
      window.alert(
        "TokenFarm not deployed to current network. Please switch to a compatible network."
      );
    }

    this.setState({ loading: false });
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true });
    this.state.credtoken.methods
      .approve(this.state.tokenfarm._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: true });
        this.state.tokenfarm.methods
          .depositTokens(amount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            console.log("Deposit transaction hash: ", hash);
            this.setState({ loading: false });
            alert("Staking successful!");
            console.log("Staking successful - transaction hash: ", hash);
            window.location.reload();
          })
          .on("error", (error) => {
            this.setState({ loading: false });
            alert("Staking failed!");
            console.log("Staking failed - error: ", error);
          });
      });
  };

  // This function is used to unstake tokens
  unstakeTokens = () => {
    this.setState({ loading: true });
    this.state.tokenfarm.methods
      .unstakeTokens()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
        window.location.reload();
        alert("Tokens unstaked successfully!"); // frontend alert
        console.log("Tokens unstaked successfully!"); // console log
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
        alert("Tokens issued successfully!");
        console.log("Tokens issued successfully!");
      })
      .on("error", (error) => {
        console.error(error);
        alert("There was an error issuing tokens.");
        this.setState({ loading: false });
        console.log("Error issuing tokens: ", error);
      });
  };

  // This function is used to claim tokens
  claimTokens = () => {
    this.setState({ loading: true });
    this.state.tokenfarm.methods
      .claimTokens()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
        window.location.reload();
        alert("Tokens claimed successfully!");
        console.log("Tokens claimed successfully!");
      })
      .on("error", (error) => {
        console.error(error);
        alert("There was an error claiming tokens.");
        this.setState({ loading: false });
      });
  };

  constructor(props) {
    super(props);
    // Initializes the component's state
    this.state = {
      account: "0x0",
      credtoken: {},
      gains: {},
      tokenfarm: {},
      stakeEvents: [],
      TstakeEvents: [],
      credtokenBalance: "0",
      gainsTokenBalance: "0",
      stakingBalance: "0",
      loading: true,
    };
  }

  // The render function defines the rendering logic for the component.
  // It returns different content depending on the loading state of the component.
  // If loading is true, a spinner is displayed.
  // Otherwise, the main content of the component is rendered.

  render() {
    let content;
    // Determine what to display based on the loading state
    this.state.loading
      ? // Display a spinner if loading is true
        (content = (
          <div>
            <div
              className="card mt-5 text-center"
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <span style={{ color: "white" }}>
                <Spinner />
              </span>
            </div>
          </div>
        ))
      : // Display the main content if loading is false
        (content = (
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
            TstakeEvents={this.state.TstakeEvents}
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
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 col-md-8 col-sm-10 ml-auto mr-auto"
              style={{ height: "100%", minHeight: "100vh" }}
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

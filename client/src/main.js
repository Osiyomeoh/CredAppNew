import React, { Component } from "react";
import tether from "./images/sym.png";
import Airdrop from "./components/Airdrop.js";
import { Card } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";

function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function convertToEther(amount) {
  return amount / 10 ** 18;
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const day = date
    .getDate()
    .toString()
    .padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date
    .getHours()
    .toString()
    .padStart(2, "0");
  const minutes = date
    .getMinutes()
    .toString()
    .padStart(2, "0");
  const seconds = date
    .getSeconds()
    .toString()
    .padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyList: [],
      count: 0,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stakingBalance !== this.props.stakingBalance) {
      let date = new Date().toLocaleString();
      let count = this.state.count + 1;
      let item = (
        <li className="list-group-item" key={count}>
          <div className="row">
            <div className="col-sm-2">
              <strong>{count}.</strong>
            </div>
            <div className="col-sm-2">
              <strong>Account:</strong> {this.props.account}
            </div>
            <div className="col-sm-2">
              <strong>Staked:</strong>{" "}
              {window.web3.utils.fromWei(this.props.stakingBalance, "Ether")}{" "}
              mCred
            </div>
            <div className="col-sm-2">
              <strong>Gains:</strong>{" "}
              {window.web3.utils.fromWei(this.props.gainsTokenBalance, "Ether")}{" "}
              Gs
            </div>
            <div className="col-sm-4">
              <strong>Time:</strong> {date}
            </div>
          </div>
        </li>
      );
      let historyList = [...this.state.historyList, item];
      this.setState({ historyList, count });
    }
  }
  render() {
    const styles = {
      body: {
        backgroundColor: "transparent",
        padding: "0",
      },
      carousel: {
        backgroundColor: "transparent",
      },
      card: {
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        margin: "20px",
        maxWidth: "400px",
      },
      image: {
        objectFit: "cover",
        height: "200px",
        borderRadius: "10px 10px 0 0",
      },
      title: {
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "0",
      },
    };

    return (
      <div>
        {/* Card container for displaying the app message */}
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
        >
          {/* Scrolling message */}
          <div class="container">
            <div class="row">
              <div class="col">
                <marquee behavior="scroll" direction="left" scrollamount="3">
                  <span class="font-weight-bold text-danger">
                    Click on the Documentation tab on the menu to understand how
                    the app works
                  </span>
                </marquee>
              </div>
            </div>
          </div>
        </div>

        {/* Main content container */}
        <div id="content" className="mt-5">
          {/* Claim USDT button */}
          <button
            type="submit"
            onClick={(event) => {
              event.preventDefault(this.props.claimTokens());
            }}
            className="btn btn-outline-light btn-md btn-block btn-white-space nowrap tr"
          >
            Claim mCred
          </button>
          &nbsp;&nbsp;
          {/* Table displaying staking and reward balances */}
          <table className="table text-muted text-center">
            <thead>
              <tr style={{ color: "white" }}>
                <th scope="col">Staking Balance</th>
                <th scope="col">Gains Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ color: "white" }}>
                <td>
                  {window.web3.utils.fromWei(
                    this.props.stakingBalance,
                    "Ether"
                  ) + " mCred"}
                </td>

                <td>
                  {/* Convert reward balance from Wei to RWD */}
                  {window.web3.utils.fromWei(
                    this.props.gainsTokenBalance,
                    "Ether"
                  )}{" "}
                  Gs
                </td>
              </tr>
            </tbody>
          </table>
          {/* Form for staking tokens */}
          <div
            className="card mb-2"
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
          >
            <form
              // prevent the default form submission behavior and handle the submission manually
              onSubmit={(event) => {
                event.preventDefault();
                let amount;
                // get the value of the input field and convert it to Ether
                amount = this.input.value.toString();
                amount = window.web3.utils.toWei(amount, "Ether");
                // call the stakeTokens function from props with the converted amount as argument
                this.props.stakeTokens(amount);
              }}
              // add some margin at the bottom and set the width and padding of the container
              className="mb-3"
            >
              <div
                style={{
                  borderSpacing: "0 1em",
                  width: "100%",
                  padding: "0 10px",
                }}
              >
                {/* display the balance of the token in the wallet */}
                <span
                  className="float-right"
                  style={{ color: "white", margin: "8px", marginRight: "1px" }}
                >
                  Balance:{" "}
                  {window.web3.utils.fromWei(
                    this.props.credtokenBalance,
                    "Ether"
                  )}
                </span>
                {/* input field for the amount of tokens to be staked */}
                <div className="input-group mb-4 ml-0.6">
                  <input
                    // assign a reference to the input element for later access
                    ref={(input) => {
                      this.input = input;
                    }}
                    type="number"
                    placeholder="0"
                    style={{
                      border: "1px solid azure",
                      borderRadius: ".2rem",
                    }}
                    required
                  />
                  {/* display the token symbol next to the input field */}
                  <div className="input-group-open">
                    <div
                      className="input-group-text ml-1"
                      style={{
                        backgroundColor: "rgba(137, 145, 211, 0.38)",
                        cursor: "pointer",
                        boxShadow: "2px 3px 68px -46px rgba(0, 123, 255, 1)",
                        color: "white",
                      }}
                    >
                      <img src={tether} alt="tether" height="50" width="50" />
                      &nbsp;&nbsp; mCred
                    </div>
                  </div>
                </div>
                {/* button for staking tokens */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block btn-white-space nowrap"
                >
                  Stake
                </button>
                {/* button for unstaking all tokens */}
                <button
                  type="submit"
                  onClick={(event) => {
                    event.preventDefault(this.props.unstakeTokens());
                  }}
                  className="btn btn-primary btn-lg btn-block btn-white-space nowrap"
                >
                  Unstake All
                </button>
              </div>
            </form>
            {/* display the Airdrop component for issuing tokens */}
            <div className="card-body text-center" style={{ color: "white" }}>
              Airdrop
              <Airdrop
                stakingBalance={this.props.stakingBalance}
                issueTokens={this.props.issueTokens}
              />
            </div>

            {/* display the stake events as a carousel */}
            <Card bg="transparent" border="light">
              <Card.Header>
                <h1>Stake Events</h1>
              </Card.Header>
              <Card.Body style={styles.body}>
                {/* if there are stake events, display them in a carousel */}
                {this.props.stakeEvents ? (
                  <Carousel
                    interval={5000}
                    pause={false}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    {this.props.stakeEvents.map((event, index) => (
                      <Card
                        key={index}
                        style={{ ...styles.card, width: "400px" }}
                      >
                        <Card.Img
                          variant="top"
                          src={`https://source.unsplash.com/500x300/?technology/${index}`}
                          style={styles.image}
                        />
                        <Card.Body>
                          <Card.Title style={styles.title}>
                            {shortenAddress(event.staker)}
                          </Card.Title>
                          <Card.Text>
                            Amount (ETH):{" "}
                            {convertToEther(event.amount).toFixed(4)}
                          </Card.Text>
                          <Card.Text>
                            Timestamp: {formatDate(event.timestamp)}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    ))}
                  </Carousel>
                ) : (
                  <p>No stake events found.</p>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;

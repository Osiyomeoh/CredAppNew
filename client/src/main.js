import React, { Component } from "react";
import tether from "./images/sym.png";
import Airdrop from "./components/Airdrop.js";
import { Card } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import Marquee from "react-fast-marquee";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function convertToEther(amount) {
  return amount / 10 ** 18;
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyList: [],
      count: 0,
      showConfirmationDialog: false, // track if the confirmation dialog should be shown
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
    const condition = true;
    const value = 10;
    const tooltip = <Tooltip id="tooltip">Click to claim mCred</Tooltip>;
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
          className="card mt-5 text-center "
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
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          {/* Scrolling message */}
          <div className="container">
            <div className="row">
              <div className="col">
                <Marquee
                  speed={25}
                  direction="left"
                  pauseOnHover={true}
                  gradient={false}
                  style={{
                    backgroundColor: "white",
                    padding: "7px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  Click on the Documentation tab on the menu to understand how
                  the app works&nbsp;&nbsp;
                </Marquee>
              </div>
            </div>
          </div>
        </div>

        {/* Main content container */}
        <div
          id="content"
          className="mt-5"
          style={{ maxWidth: "500px", margin: "0 auto" }}
        >
          {/* Claim mcred button */}
          <OverlayTrigger placement="top" overlay={tooltip}>
            <button
              type="submit"
              onClick={(event) => {
                event.preventDefault(this.props.claimTokens());
              }}
              className="btn btn-outline-light btn-md btn-block btn-white-space nowrap tr"
              style={{
                transition: "background-color 0.2s ease-out",
                backgroundColor: "#007bff",
                borderColor: "#007bff",
                color: "#fff",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#28a745";
                e.target.style.borderColor = "#28a745";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#007bff";
                e.target.style.borderColor = "#007bff";
              }}
            >
              Claim mCred
            </button>
          </OverlayTrigger>
          &nbsp;&nbsp;
          {/* Table displaying staking and reward balances */}
          <div className="card mb-2 bg-transparent">
            <div className="card-header bg-dark text-light text-center">
              Staking Information
            </div>
            <div className="card-body">
              <table className="table text-muted text-center">
                <thead>
                  <tr>
                    <th>Staking Balance</th>
                    <th>Gains Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {window.web3.utils.fromWei(
                        this.props.stakingBalance,
                        "Ether"
                      ) + " mCred"}
                    </td>
                    <td>
                      {window.web3.utils.fromWei(
                        this.props.gainsTokenBalance,
                        "Ether"
                      )}{" "}
                      Gs
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Form for staking tokens */}
          <div
            className="card mb-2"
            style={{
              borderRadius: ".5rem",
              border: "1px solid transparent",
              backdropFilter: "blur(0.2rem)",
              boxShadow: "1.3rem 1.3rem 1.3rem rgba(0, 0, 0, 0.1)",
              borderTopColor: "rgba(225, 225, 225, 0.5)",
              borderLeftColor: "rgba(225, 225, 225, 0.5)",

              borderBottomColor: "rgba(225, 225, 225, 0.1)",
              borderRightColor: "rgba(225, 225, 225, 0.1)",
              backgroundColor: "transparent",
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
                  className="float-right px-3 py-2 bg-secondary text-white font-weight-bold"
                  style={{ fontSize: "1.2rem" }}
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
                <div style={{}}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <button
                      type="submit"
                      className="btn btn-success btn-lg btn-block btn-white-space"
                      style={{
                        width: "100%",
                        marginBottom: "10px",
                        borderRadius: "25px",
                      }}
                    >
                      Stake
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <button
                      type="submit"
                      onClick={() =>
                        this.setState({ showConfirmationDialog: true })
                      } // show the confirmation dialog when clicked
                      className="btn btn-danger btn-lg btn-block btn-white-space"
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        borderRadius: "25px",
                      }}
                    >
                      Unstake
                    </button>

                    {/* Confirmation dialog */}
                    {this.state.showConfirmationDialog && (
                      <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">Confirm Unstaking</h5>
                              <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={() =>
                                  this.setState({
                                    showConfirmationDialog: false,
                                  })
                                } // hide the confirmation dialog when closed
                              >
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              Are you sure you want to unstake your tokens?
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal"
                                onClick={() =>
                                  this.setState({
                                    showConfirmationDialog: false,
                                  })
                                } // hide the confirmation dialog when cancelled
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="btn btn-danger"
                                onClick={() => {
                                  this.props.unstakeTokens(); // unstake tokens when confirmed
                                  this.setState({
                                    showConfirmationDialog: false,
                                  }); // hide the confirmation dialog
                                }}
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
          </div>
        </div>
        <div
          className="row justify-content-center"
          style={{ maxWidth: "900px", margin: "0 auto" }}
        >
          <div className="col-md-6">
            <Card bg="transparent" border="light" className="mx-auto">
              <Card.Header>
                <h1 className="text-center">Stake Events</h1>
              </Card.Header>
              <Card.Body style={styles.body}>
                {/* if there are stake events, display them in a carousel */}
                {this.props.stakeEvents ? (
                  <Carousel
                    interval={5000}
                    pause={condition ? value.toString() : undefined}
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
                            <CopyToClipboard text={event.staker}>
                              <span
                                style={{
                                  cursor: "pointer",
                                  text: "underline",
                                }}
                                className="text-primary"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Click to copy"
                              >
                                {shortenAddress(event.staker)}
                              </span>
                            </CopyToClipboard>
                          </Card.Title>
                          <Card.Text>
                            Amount (mCred):{" "}
                            {convertToEther(event.amount).toFixed(4)}
                            &nbsp;&nbsp;
                            <span> {formatDate(event.timestamp)}</span>
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
          <div className="col-md-6">
            {/* display the stake events as a carousel */}

            <Card bg="transparent" border="light" className="mx-auto">
              <Card.Header>
                <h1 className="text-center">Gains Events</h1>
              </Card.Header>
              <Card.Body style={styles.body}>
                {/* if there are stake events, display them in a carousel */}
                {this.props.TstakeEvents ? (
                  <Carousel
                    interval={5000}
                    pause={condition ? value.toString() : undefined}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    {this.props.TstakeEvents.map((neww, index) => (
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
                            <CopyToClipboard text={neww.staker}>
                              <span
                                style={{
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                }}
                                className="text-primary"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Click to copy"
                              >
                                {shortenAddress(neww.recipient)}
                              </span>
                            </CopyToClipboard>
                          </Card.Title>
                          <Card.Text>
                            Gains (mCred):{" "}
                            {convertToEther(neww.amount).toFixed(4)}
                            &nbsp;&nbsp; {formatDate(neww.timestamp)}
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

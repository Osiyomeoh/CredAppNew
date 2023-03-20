import React, { Component } from "react";
import tether from "./images/sym.png";
import Airdrop from "./components/Airdrop.js";

class Main extends Component {
  
  render() {

  

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
  {  window.web3.utils.fromWei(
        this.props.stakingBalance,
        "Ether"
      ) + " mCred"
    }
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
              onSubmit={(event) => {
                event.preventDefault();
                let amount;
                amount = this.input.value.toString();
                amount = window.web3.utils.toWei(amount, "Ether");
                this.props.stakeTokens(amount);
              }}
              className="mb-3"
            >
              <div
                style={{
                  borderSpacing: "0 1em",
                  width: "100%",
                  padding: "0 10px",
                }}
              >
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
                <div className="input-group mb-4 ml-0.6">
                  <input
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
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block btn-white-space nowrap"
                >
                  Stake
                </button>
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
            <div className="card-body text-center" style={{ color: "white" }}>
              Airdrop
              <Airdrop
                stakingBalance={this.props.stakingBalance}
                issueTokens={this.props.issueTokens}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;

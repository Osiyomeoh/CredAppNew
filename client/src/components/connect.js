import React, { useContext, useState, useEffect } from "react";
import bank from "../images/neww.png";
import { shortenAddress } from "../utils/shortenAddress";
import { Button, Modal } from "react-bootstrap";

import { TransactionContext } from "../context/TransactionContext";

const Connect = () => {
  const { connectWallet,  disconnectWallet, currentAccount } = useContext(TransactionContext);
  const [showModal, setShowModal] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState([]);

  // Fetch crypto prices from CoinGecko API
  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,dogecoin&vs_currencies=usd"
        );
        const data = await response.json();
        setCryptoPrices(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCryptoPrices();
    const intervalId = setInterval(fetchCryptoPrices, 10000); // Refresh prices every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleAddressClick = () => {
    navigator.clipboard.writeText(currentAccount);
    alert("Address copied to clipboard!");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top shadow p-0 bg-dark"
      style={{ height: "50px", opacity: ".85" }}
    >
      {/* Brand/logo */}
      <a
        href="/#"
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        style={{ color: "white" }}
      >
        <img
          src={bank}
          width="110"
          height="40"
          className="d-inline-block align-top"
          alt="bank"
        />
      </a>

      {/* Mobile menu icon */}
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Menu items */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          {/* Home */}

          {/* About */}
          <li>
            <Button variant="link" onClick={() => setShowModal(true)}>
              Documentation
            </Button>
          </li>
          
        </ul>

        {/* Crypto prices */}
        <ul className="navbar-nav mx-auto">
          {cryptoPrices && (
            <li className="nav-item">
              <marquee className="text-white" behavior="scroll" direction="left" scrollamount="3">
                {Object.entries(cryptoPrices)
                  .map(([key, value]) => `${key.toUpperCase()}: $${value.usd}`)
                  .join(" | ")}
              </marquee>
            </li>
          )}
        </ul>

        {/* Address and Connect/Disconnect Wallet button */}
    <ul className="navbar-nav">
      {/* Address */}
      <li className="text-nowrap nav-item d-none d-lg-block mr-3">
        <small style={{ color: "white", cursor: "pointer" }} onClick={handleAddressClick}>
          Address: {shortenAddress(currentAccount)}
        </small>
      </li>

      {/* Connect/Disconnect Wallet button */}
      <li className="nav-item">
        {!currentAccount && (
          <button
            type="button"
            onClick={connectWallet}
            className="btn btn-info btn-sm"
          >
            Connect Wallet
          </button>
        )}
        {currentAccount && (
          <div className="d-flex">
            <button
              type="button"
              className="btn btn-success btn-sm mr-2"
              disabled
            >
              Connected
            </button>
            <button
              type="button"
              onClick={disconnectWallet}
              className="btn btn-danger btn-sm"
            >
              Swap_Account
            </button>
          </div>
        )}
      </li>
    </ul>

    {/* Documentation Modal */}
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Documentation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Connect your MetaMask wallet to our platform.</p>
        <p>
          We currently support live test networks such as Rinkeby, Stardust,
          Mumbai, and Meter.
        </p>
        <p>Claim 50 mUSDT tokens for staking.</p>
        <p>Stake your mUSDT tokens and wait for 1 minute.</p>
        <p>
          While waiting, enjoy some particle interactions on our platform.
        </p>
        <p>
          Once the timer ends, you will receive an airdrop of RWD tokens.
        </p>
        <p>You can unstake your mUSDT tokens anytime you want.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
</nav>
  );
};

export default Connect;

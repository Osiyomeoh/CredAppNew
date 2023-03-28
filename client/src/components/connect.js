import React, { useContext, useState, useEffect, useCallback } from "react";
import bank from "../images/neww.png";
import { shortenAddress } from "../utils/shortenAddress";
import { Button, Modal, Navbar, Nav } from "react-bootstrap";
import Marquee from "react-fast-marquee";
import { TransactionContext } from "../context/TransactionContext";

const Connect = () => {
  // Access the connectWallet, disconnectWallet, and currentAccount variables from the TransactionContext
  const { connectWallet, disconnectWallet, currentAccount } = useContext(
    TransactionContext
  );

  // Set up local state to manage the visibility of the documentation modal
  const [showModal, setShowModal] = useState(false);

  // Set up local state to hold the current prices of cryptocurrencies
  const [cryptoPrices, setCryptoPrices] = useState([]);

  // Define a callback to disconnect the wallet that can be used in a useEffect hook
  const disconnectWalletCallback = useCallback(() => {
    disconnectWallet();
  }, [disconnectWallet]);

  // Fetch crypto prices from CoinGecko API and refresh every 10 seconds
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
    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  // Copy the user's wallet address to the clipboard and display a confirmation message on click
  const handleAddressClick = () => {
    navigator.clipboard.writeText(currentAccount);
    alert("Address copied to clipboard!");
  };

  return (
    // Bootstrap Navbar component
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      fixed="top"
      className="shadow p-0"
    >
      {/* Navbar brand */}
      <Navbar.Brand href="/" style={{ color: "white" }}>
        <img
          src={bank}
          width="110"
          height="40"
          className="d-inline-block align-top"
          alt="bank"
        />
      </Navbar.Brand>
      {/* Navbar toggle button for mobile */}
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      {/* Navbar items */}
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <Nav>
          {/* Documentation button that shows the modal */}
          <Nav.Link>
            <Button variant="link" onClick={() => setShowModal(true)}>
              Documentation
            </Button>
          </Nav.Link>
          {/* Marquee displaying cryptocurrency prices */}
          <Nav.Link>
            {cryptoPrices && (
              <Marquee
                speed={1}
                direction="left"
                pauseOnHover={true}
                gradient={false}
                style={{
                  backgroundColor: "dark",
                  padding: "7px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                {Object.entries(cryptoPrices)
                  .map(([key, value]) => `${key.toUpperCase()}: $${value.usd}`)
                  .join(" | ")}
                &nbsp;&nbsp;
              </Marquee>
            )}
          </Nav.Link>
          {/* User's wallet address */}
          <Nav.Link className="text-nowrap mr-3">
            <small
              style={{ color: "white", cursor: "pointer" }}
              onClick={handleAddressClick}
            >
              Address: {shortenAddress(currentAccount)}
            </small>
          </Nav.Link>
          {/* Connect/disconnect wallet buttons */}
          <Nav.Link>
            {!currentAccount && (
              <Button onClick={connectWallet} variant="info" size="sm">
                Connect Wallet
              </Button>
            )}
            {currentAccount && (
              <div className="d-flex">
                <Button variant="success" size="sm" disabled>
                  Connected
                </Button>
                <Button
                  onClick={disconnectWalletCallback}
                  variant="danger"
                  size="sm"
                  className="ml-2"
                >
                  Swap_Account
                </Button>
              </div>
            )}
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Documentation</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h1>About Credence</h1> {/* Heading for About page */}
          <p>
            Credence is a crypto staking app that allows users to earn rewards
            by staking their cryptocurrency. Our platform uses a secure and
            reliable system to ensure that your funds are always safe and
            accessible.
          </p>
          <p>
            To participate, please make sure to follow these steps:{" "}
            {/* Steps to participate */}
          </p>
          <ol>
            <li>
              Connect your MetaMask wallet to our platform if you are not
              already connected
            </li>{" "}
            {/* Step 1 */}
            <li>We currently support live test network such as Mumbai</li>{" "}
            {/* Step 2 */}
            <li>
              You can swap account on the test network and then refresh the page
            </li>{" "}
            {/* Step 3 */}
            <li>Claim 10 mCred tokens for staking.</li> {/* Step 4 */}
            <li>Stake your mCred tokens and wait for 1 minute.</li>{" "}
            {/* Step 5 */}
            <li>
              While waiting, enjoy some particle interactions on our platform.
            </li>{" "}
            {/* Step 6 */}
            <li>
              Once the timer ends, you will receive an airdrop of Gains tokens.
            </li>{" "}
            {/* Step 7 */}
            <li>You can unstake your mCred tokens anytime you want.</li>{" "}
            {/* Step 8 */}
            <li>Refresh the page after every transaction</li> {/* Step 9 */}
          </ol>
          <p>
            Our team is dedicated to providing a seamless and user-friendly
            experience for our customers. If you have any questions or feedback,
            please feel free to contact us at support@credence.com.{" "}
            {/* Contact information */}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
};

export default Connect;

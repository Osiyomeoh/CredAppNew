import React, { useState } from "react";

const Deposit = (props) => {
  const [startingBalance, setStartingBalance] = useState("");

  const handleInputChange = (event) => {
    setStartingBalance(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const balanceInWei = startingBalance * 10 ** 18;
    props.addStartingBalance(balanceInWei);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="number"
          className="form-control"
          placeholder="Enter starting balance in Ether"
          value={startingBalance}
          onChange={handleInputChange}
        />
      </div>
      <button
        type="submit"
        className="btn btn-outline-light btn-md btn-block btn-white-space nowrap tr"
      >
        Deposit mCred
      </button>
    </form>
  );
};

export default Deposit;

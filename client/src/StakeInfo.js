import React from 'react';
import Table from 'react-bootstrap/Table';

function StakeInfo({ stakeInfo }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>User</th>
          <th>Amount</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {stakeInfo.map((stake, index) => (
          <tr key={stake.time}>
            <td>{index + 1}</td>
            <td>{stake.user}</td>
            <td>{stake.amount}</td>
            <td>{new Date(stake.time * 1000).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default StakeInfo;

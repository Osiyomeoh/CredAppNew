/* eslint-disable no-undef */
const Gains = artifacts.require("Gains");
const CredToken = artifacts.require("CredToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer) {
  // Deploy Tether Token
  await deployer.deploy(CredToken);
  const credtoken = await CredToken.deployed();

  // Deploy RWD Token
  await deployer.deploy(Gains);
  const gains = await Gains.deployed();

  // Deploy DecentralBank
  await deployer.deploy(TokenFarm, gains.address, credtoken.address);
  const tokenfarm = await TokenFarm.deployed();

  // Transfer all reward tokens to CredenceApp (1 million)
  await gains.transfer(tokenfarm.address, "1000000000000000000000000");

  // Transfer all Tether tokens to CredenceApp  (1 million)
  await credtoken.transfer(tokenfarm.address, "1000000000000000000000000");
};
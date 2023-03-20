const main = async () => {

  const hre = require("hardhat");
  
  // const Transactions = await hre.ethers.getContractFactory("Transactions");
  // const transactions = await Transactions.deploy();
  const [owner, addr1, ...addrs] = await ethers.getSigners();
  const totalSupply = ethers.utils.parseEther('0.01')
  const CredToken = await hre.ethers.getContractFactory("CredToken");
  const credtoken = await CredToken.deploy({value: totalSupply});
  await credtoken.deployed(); 

  const TotalSupply = ethers.utils.parseEther('0.01')
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const testtoken = await TestToken.deploy({ value: TotalSupply});
  await testtoken.deployed();
  
  
  // const TokenFarm = await hre.ethers.getContractFactory("TokenFarm");
  // const tokenfarm = await TokenFarm.deploy(CredToken, TestToken); 

  // await tokenfarm.deployed();

 
  
  

  // console.log("Transactions deployed to:", transactions.address);
  console.log("CredToken deployed to:", credtoken.address);
  // console.log("TokenFarm deployed to:", tokenfarm.address);
  console.log("TestToken deployed to:", testtoken.address);
  
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();
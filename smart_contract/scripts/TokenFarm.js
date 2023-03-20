const main = async () => {

    const hre = require("hardhat");
    
    //const [owner, addr1, ...addrs] = await ethers.getSigners();

  
  
    const TokenFarm = await hre.ethers.getContractFactory("TokenFarm");


     const tokenfarm = await TokenFarm.deploy(); 
  
     await tokenfarm.deployed();
  
   
    
    
  
    
     console.log("TokenFarm deployed to:", tokenfarm.address);
    
    
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
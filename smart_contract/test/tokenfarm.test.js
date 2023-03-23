/* eslint-disable no-undef */
const Gains = artifacts.require("Gains");
const CredToken = artifacts.require("CredToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("TokenFarm", ([owner, customer]) => {
  let credtoken, gains, tokenfarm;

  function tokens(number) {
    return web3.utils.toWei(number, "ether");
  }

  before(async () => {
    // Load Contracts
    credtoken = await CredToken.new();
    gains = await Gains.new();
    tokenfarm = await TokenFarm.new(gains.address, credtoken.address);

    // Transfer all tokens to TokenFarm (1 million)
    await gains.transfer(tokenfarm.address, tokens("1000000"));

    // Transfer 100 mock CredToken to Customer
    await credtoken.transfer(customer, tokens("100"), { from: owner });
  });

  describe("Mock Cred Token Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await credtoken.name();
      assert.equal(name, "Mock Cred Token");
    });
  });

  describe("Gains Token Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await gains.name();
      assert.equal(name, "Gains Token");
    });
  });

  describe("Token Farm Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await tokenfarm.name();
      assert.equal(name, "Token Farm");
    });

    it("contract has tokens", async () => {
      let balance = await gains.balanceOf(tokenfarm.address);
      assert.equal(balance, tokens("1000000"));
    });

    describe("Yield Farming", async () => {
      it("rewards tokens for staking", async () => {
        let result;

        // Check Investor Balance.
        result = await credtoken.balanceOf(customer);
        assert.equal(
          result.toString(),
          tokens("100"),
          "customer mock wallet balance before staking"
        );

        // Check Staking For Customer of 100 tokens.
        await credtoken.approve(tokenfarm.address, tokens("100"), {
          from: customer,
        });
        await tokenfarm.depositTokens(tokens("100"), { from: customer });

        // Check Updated Balance of Customer.
        result = await credtoken.balanceOf(customer);
        assert.equal(
          result.toString(),
          tokens("0"),
          "customer mock wallet balance after staking 100 tokens"
        );

        // Check Updated Balance of Decentral Bank.
        result = await credtoken.balanceOf(tokenfarm.address);
        assert.equal(
          result.toString(),
          tokens("100"),
          "decentral bank mock wallet balance after staking from customer"
        );

        // Is Staking Update.
        result = await tokenfarm.isStaking(customer);
        assert.equal(
          result.toString(),
          "true",
          "customer is staking status after staking"
        );

        // Issue Tokens.
        await tokenfarm.issueTokens({ from: owner });

        // // Ensure Only The Owner Can Issue Tokens.
        // await TokenFarm.issueTokens({from: customer}).should.be.rejected;

        // Unstake Tokens
        await tokenfarm.unstakeTokens({ from: customer });

        // Check Unstaking Balances.

        result = await credtoken.balanceOf(customer);
        assert.equal(
          result.toString(),
          tokens("100"),
          "customer mock wallet balance after unstaking"
        );

        // Check Updated Balance of TokenFram.
        result = await credtoken.balanceOf(tokenfarm.address);
        assert.equal(
          result.toString(),
          tokens("0"),
          "decentral bank mock wallet balance after staking from customer"
        );

        // Is Staking Update.
        result = await tokenfarm.isStaking(customer);
        assert.equal(
          result.toString(),
          "false",
          "customer is no longer staking after unstaking"
        );
      });
    });
  });
});

const { assert } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name) //  w zalezności od sieci na jakiej prowadzimy test lokalna/zdalna
    ? describe.skip // pomija cały describe
    : describe("FundMe Staging Tests", async function () {
          let deployer
          let fundMe
          const sendValue = ethers.utils.parseEther("0.05")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue, gasLimit: 25e6 })
              await fundMe.withdraw({
                  gasLimit: 25e6,
              })
              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endingFundMeBalance.toString(), "0")
          })
      })

const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSVER,
} = require("../helper-hardhat-config")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    // https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/tests/MockV3Aggregator.sol
    if (developmentChains.includes(network.name)) {
        log("local network detected! deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSVER], // patrzymy w constructor funkcji MockV3Aggregator w repo lub node_modules i widzimy że przyjmuje 2 argumenty które definiujemy w helper-hardhat-config.js
        })
        log("Mocks deployed!")
        log(
            "--------------------------------------------------------------------------"
        )
    }
}
module.exports.tags = ["all", "mocks"] // dzięki temu możemy wywołać tylko niektóre skrypty [yarn hardhat deploy --tags mocks] tagi odnoszą się do nazwy plików

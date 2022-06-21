require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")

// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const RINKEBY_RPC_URL =
    process.env.RINKEBY_RPC_URL || "https://eth-rinkeby/example"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"
const COINMARKETCUP_API_KEY = process.env.COINMARKETCUP_API_KEY || "key"

module.exports = {
    defaultNetwork: "hardhat", // to jest i tak ustawione, ale jak chcemy zmianić to tu
    networks: {
        rinkeby: {
            //nazw sieci
            url: RINKEBY_RPC_URL, // adres RPC z Alchemy
            accounts: [PRIVATE_KEY], // klucz prywantny z MM
            chainId: 4, // nie konieczne ale lepiej dodać (chainlist.org)
            blockConfirmations: 6, // po ilu blokach dostaniemy potwierdzenie
        },
        localhost: {
            // [yarn hardhat node]
            url: "http://127.0.0.1:8545/",
            // accounts są automatycznie dodane
            chainId: 31337, // takie samo jak hardhat
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.8",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        token: "ETH",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCUP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
}

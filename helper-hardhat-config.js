// definiujemy adresy zwracajace kurs ETH/USD w zależności od sieci
// https://chainlist.org/  na tej stronie sprawdzimy jakie chainId ma dana sieć
// https://docs.chain.link/docs/reference-contracts - tu znajdują się adresy z kursem w zależności od sieci
const networkConfig = {
    31337: {
        name: "localhost",
    },
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    // Default one is ETH/USD contract on Kovan
    42: {
        name: "kovan",
        ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    },
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
}

const developmentChains = ["hardhat", "localhost"] // określamy dla jakich chainów ma być uruchomiony lokalny chain
const DECIMALS = 8
const INITIAL_ANSVER = 200000000000

module.exports = {
    // eksportujemy obiekty tak żeby inne skryty miały do nich dostę (jest też inny sposób eksportowania)
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSVER,
}

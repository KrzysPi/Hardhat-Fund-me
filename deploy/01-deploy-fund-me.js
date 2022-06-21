const { networkConfig, developmentChains } = require("../helper-hardhat-config") // importujemy
const { network } = require("hardhat")
const { verify } = require("../utils/verify")
// powyzsze w jednej linii
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments // wyciagamy 2 funcje z deployments
    const { deployer } = await getNamedAccounts() // wywołuje i oczekuje na zwrot funkcji getNamedAccount() i zwraca wynik do deployer
    // deployer musi zostać zdefiniowany w {hardhat.config.js}
    const chainId = network.config.chainId // zasysa zdefiniowany rodzaj sieci z {hardhat.config.js}

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"] // w zmiennej zostanie zapisany chainId i address, dzieki temu przy byboze sieci [yarn hardhat deploy --network rinkeby] zostanie pobrany odpowiedni adres
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        // jezeli nazwa sieci znajduje sie w zmiennej developmentChain  (umieszczona w {helper-hardhat-config.js}
        const ethUsdAggregator = await deployments.get("MockV3Aggregator") // uruchamiamy mock
        ethUsdPriceFeedAddress = ethUsdAggregator.address // zrzucamy adres uzyskany z mock
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"] // w przeciwnym razie nie uruchamia mock tylko bierze adres dla sieci jaki zdefiniowaliśmy w {helper-hardhat-config.js}
        //youtube 10:51:00
    }

    // const address = 0x8a753747a1fa494ec906ce90e9f37563a8af630e
    // when going for localhost or hardhat network we want to use mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConifirmations: network.config.blockConfirmations || 1, // zaciągamy ilość bloków jakie musimy czekać do potwierdzenia, jeżeli blockConfimations nie jest zdefinowane wtedy 1
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("-----------------------------------------------------------------")
}
module.exports.tags = ["all", "fundme"] // pozwala oznaczyć plik przy wywoływaniu, ten ma 2 tagi all i fundme
// inne skrypty maja równiez tagi w ten sposob mozemy wywoływać konkretne skrypty lub wszytkie

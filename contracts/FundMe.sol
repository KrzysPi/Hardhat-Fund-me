// SPDX-License-Identifier: MIT

// w punktach podana kolejnść definiowania poczszegulnych rzeczy (nie szystkie definujemy w tym kontrakcie)
// https://docs.soliditylang.org/en/latest/style-guide.html#order-of-layout
// 1. Pragma
pragma solidity ^0.8.8;

// 2. Imports
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

// 3. Error code
error FundMe__NotOwner(); // NazwaKontraktu__NazwaBłędu dzieki temu wiemy jaki kontrakt go zwraca 

// 4. Interfaces
// 5. Libraries
// 6. Contracts

/**@title A sample Funding Contract
 * @author Kris Pi
 * @notice This contract is for creating a sample funding contract
 * @dev This implements price feeds as our library
 */
 // tworzymy opis kontraktu, umozliwia automatyczne tworzenie dokumentacji
 // tworzymy przez /**<opis> */ lub jedna linia /// <opis>
 // https://docs.soliditylang.org/en/v0.8.13/natspec-format.html#natspec
contract FundMe {
    // 6.1 Types declaration
    using PriceConverter for uint256;
    // 6.2 State Variables 
    // konwencje nazywania znajdziemy https://docs.soliditylang.org/en/v0.8.13/style-guide.html#naming-conventions
    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;
    // Could we make this constant?  /* hint: no! We should make it immutable! */
    address private /* immutable */ i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
    
    AggregatorV3Interface public s_priceFeed;


    // 6.3 Modyfiers
    modifier onlyOwner {
        // require(msg.sender == owner);
         if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    // 6.4 Functions
    // 6.4.1 Constructor
    constructor(address s_priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(s_priceFeedAddress);
    }

    // 6.4.2 receive function (if exists)
    // receive() external payable {
    //     fund();
    // }
// Explainer from: https://solidity-by-example.org/fallback/
    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \ 
    //         yes  no
    //         /     \
    //    receive()?  fallback() 
    //     /   \ 
    //   yes   no
    //  /        \
    //receive()  fallback()

    // 6.4.3 fallback function (if exists)
    // fallback() external payable {
    //     fund();
    // }

    // 6.4.4 external

    // 6.4.5 public
    function fund() public payable {
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, "You need to spend more ETH!");
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }
    
    
    function withdraw() public payable onlyOwner  {
        for (uint256 funderIndex=0; funderIndex < s_funders.length; funderIndex++){
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }
        function cheaperWithdraw() public payable onlyOwner {
            address[] memory funders = s_funders; // dzięki temu czytamy tylko raz ze storage co zaoszczędza GAS
        // nietety nie możemy zaisać mapowania w memory więc "s_addressToAmountFunded" musi zostać jak jest
            for (uint256 funderIndex=0; funderIndex < funders.length; funderIndex++){
                address funder = funders[funderIndex];
                s_addressToAmountFunded[funder] = 0;
            }
            s_funders = new address[](0);

            (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
            require(success);

        }



    // 6.4.6 internal

    // 6.4.7 private
function getOwner() public view returns(address){
    return i_owner;
}
    
function getFunder(uint256 index) public view returns(address){
    return s_funders[index];
}

function getAddressToAmountFunded(address funder)public view returns(uint256){
    return s_addressToAmountFunded[funder];
}

function getPriceFeed() public view returns(AggregatorV3Interface){
    return s_priceFeed;
}
}








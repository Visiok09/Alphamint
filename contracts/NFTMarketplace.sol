// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketplace is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint listingPrice = 0.000001 ether;
    address payable public owner;

    mapping(uint => MarketItem) private idToMarketItem;

    struct MarketItem {
        uint tokenId;
        address payable seller;
        address payable owner;
        uint price;
        bool sold;
    }

    event MarketItemCreated(uint indexed tokenId, address seller, address owner, uint price, bool sold);

    modifier onlyOwner() {
        require(msg.sender == owner, "only onwer can do it");
        _;
    }

    constructor() ERC721("Alphamint Tokens", "ALP") {
        owner = payable(msg.sender);
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable onlyOwner {
        require(owner == msg.sender, "Only marketplace owner can update listing price.");
        listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint) {
        return listingPrice;
    }

    function tokenURI(uint tokenId) public view virtual override(ERC721URIStorage) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    /* Mints a token and lists it in the marketplace */
    function createToken(string memory _tokenURI, uint price) public payable returns (uint) {
        _tokenIds.increment();
        uint newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        createMarketItem(newTokenId, price);
        return newTokenId;
    }

    function createMarketItem(uint tokenId, uint price) private {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        idToMarketItem[tokenId] = MarketItem(tokenId, payable(msg.sender), payable(address(this)), price, false);

        _transfer(msg.sender, address(this), tokenId);
        emit MarketItemCreated(tokenId, msg.sender, address(this), price, false);
    }

    /* allows someone to resell a token they have purchased */
    function resellToken(uint tokenId, uint price) public payable {
        require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
        //require(msg.value == listingPrice, "Price must be equal to listing price");
        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    function cancelListing(uint tokenId) public payable {
        require(idToMarketItem[tokenId].seller == msg.sender, "Only item owner can perform this operation");

        _transfer(address(this), msg.sender, tokenId);

        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = 0;
        idToMarketItem[tokenId].seller = payable(address(0));
        idToMarketItem[tokenId].owner = payable(msg.sender);
        _itemsSold.increment();
    }

    function createMarketSale(uint tokenId) public payable nonReentrant {
        uint price = idToMarketItem[tokenId].price;
        uint totalAmount = price + listingPrice;
        require(msg.value == totalAmount, "Please submit the asking price in order to complete the purchase");

        // Transfer price to seller
        (bool sellerTransferSuccess, ) = idToMarketItem[tokenId].seller.call{value: price}("");
        require(sellerTransferSuccess, "Seller transfer failed");

        // Transfer listingPrice to contract
        (bool listingTransferSuccess, ) = address(this).call{value: listingPrice}("");
        require(listingTransferSuccess, "Listing transfer failed");

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));

        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);
    }

    function fetchMarketItems(uint page) public view returns (MarketItem[] memory) {
        uint itemCount = _tokenIds.current();
        uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint currentIndex = 0;
        uint itemsOnPage = 2;

        if (unsoldItemCount == 0 || page <= 0) {
            // No unsold items or invalid page, return empty array
            return new MarketItem[](0);
        }

        uint startingIndex = unsoldItemCount - (page - 1) * itemsOnPage;

        uint endingIndex = startingIndex > itemsOnPage ? startingIndex - itemsOnPage : 1;
        // Ensure the starting index does not go below 1
        if (startingIndex < 1) {
            return new MarketItem[](0);
        }

        // Calculate the number of items to retrieve
        uint numItemsToRetrieve = startingIndex >= itemsOnPage ? itemsOnPage : startingIndex - endingIndex + 1;

        // Initialize the items array with the appropriate length
        MarketItem[] memory items = new MarketItem[](numItemsToRetrieve);

        // Populate the items array based on the specified page and items per page
        for (uint i = startingIndex; i >= endingIndex; i--) {
            if (i <= itemCount && i >= 1) {
                uint currentId = i;
                MarketItem storage currentItem = idToMarketItem[currentId];

                // Check if the seller is equal to the contract's address
                if (currentItem.owner == address(this)) {
                    items[currentIndex] = currentItem;
                    currentIndex += 1;
                }
            }
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchSellerNFTs(address _seller) public view returns (MarketItem[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        address topSeller = _seller;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == topSeller) {
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == topSeller) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function takeIt() public payable onlyOwner {
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success);
    }

    receive() external payable {}
}

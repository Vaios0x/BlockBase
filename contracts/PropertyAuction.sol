// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PropertyAuction {
    struct Auction {
        uint256 id;
        address seller;
        uint256 propertyId;
        uint256 startingPrice;
        uint256 currentBid;
        address currentBidder;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        bool isEnded;
        uint256 minBidIncrement;
    }

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
    }

    address public owner;
    uint256 public totalAuctions;
    uint256 public auctionFeePercentage = 2; // 2% auction fee

    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => Bid[]) public auctionBids;
    mapping(address => uint256[]) public userAuctions;
    mapping(address => uint256[]) public userBids;

    event AuctionCreated(uint256 indexed auctionId, address indexed seller, uint256 propertyId, uint256 startingPrice);
    event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed auctionId, address indexed winner, uint256 finalBid);
    event AuctionCancelled(uint256 indexed auctionId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede ejecutar esta funcion");
        _;
    }

    modifier auctionExists(uint256 _auctionId) {
        require(_auctionId > 0 && _auctionId <= totalAuctions, "Subasta no existe");
        _;
    }

    modifier onlyAuctionSeller(uint256 _auctionId) {
        require(auctions[_auctionId].seller == msg.sender, "Solo el vendedor puede ejecutar esta accion");
        _;
    }

    modifier auctionActive(uint256 _auctionId) {
        require(auctions[_auctionId].isActive, "La subasta no esta activa");
        require(block.timestamp < auctions[_auctionId].endTime, "La subasta ha terminado");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createAuction(
        uint256 _propertyId,
        uint256 _startingPrice,
        uint256 _duration,
        uint256 _minBidIncrement
    ) external returns (uint256) {
        require(_startingPrice > 0, "El precio inicial debe ser mayor a 0");
        require(_duration > 0, "La duracion debe ser mayor a 0");
        require(_minBidIncrement > 0, "El incremento minimo debe ser mayor a 0");

        totalAuctions++;
        uint256 auctionId = totalAuctions;

        auctions[auctionId] = Auction({
            id: auctionId,
            seller: msg.sender,
            propertyId: _propertyId,
            startingPrice: _startingPrice,
            currentBid: 0,
            currentBidder: address(0),
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            isActive: true,
            isEnded: false,
            minBidIncrement: _minBidIncrement
        });

        userAuctions[msg.sender].push(auctionId);

        emit AuctionCreated(auctionId, msg.sender, _propertyId, _startingPrice);
        return auctionId;
    }

    function placeBid(uint256 _auctionId) external payable auctionExists(_auctionId) auctionActive(_auctionId) {
        Auction storage auction = auctions[_auctionId];
        require(msg.sender != auction.seller, "No puedes pujar en tu propia subasta");
        require(msg.value >= auction.startingPrice, "La puja debe ser mayor o igual al precio inicial");
        
        if (auction.currentBid > 0) {
            require(msg.value >= auction.currentBid + auction.minBidIncrement, "La puja debe ser mayor a la puja actual mas el incremento minimo");
        }

        // Devolver la puja anterior si existe
        if (auction.currentBidder != address(0)) {
            payable(auction.currentBidder).transfer(auction.currentBid);
        }

        auction.currentBid = msg.value;
        auction.currentBidder = msg.sender;

        auctionBids[_auctionId].push(Bid({
            bidder: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        userBids[msg.sender].push(_auctionId);

        emit BidPlaced(_auctionId, msg.sender, msg.value);
    }

    function endAuction(uint256 _auctionId) external auctionExists(_auctionId) {
        Auction storage auction = auctions[_auctionId];
        require(auction.isActive, "La subasta no esta activa");
        require(block.timestamp >= auction.endTime || msg.sender == auction.seller, "La subasta aun no ha terminado");
        require(!auction.isEnded, "La subasta ya termino");

        auction.isActive = false;
        auction.isEnded = true;

        if (auction.currentBidder != address(0)) {
            uint256 auctionFee = (auction.currentBid * auctionFeePercentage) / 100;
            uint256 sellerAmount = auction.currentBid - auctionFee;

            payable(auction.seller).transfer(sellerAmount);

            emit AuctionEnded(_auctionId, auction.currentBidder, auction.currentBid);
        } else {
            emit AuctionEnded(_auctionId, address(0), 0);
        }
    }

    function cancelAuction(uint256 _auctionId) external auctionExists(_auctionId) onlyAuctionSeller(_auctionId) {
        Auction storage auction = auctions[_auctionId];
        require(auction.isActive, "La subasta no esta activa");
        require(auction.currentBidder == address(0), "No puedes cancelar una subasta con pujas");

        auction.isActive = false;
        auction.isEnded = true;

        emit AuctionCancelled(_auctionId);
    }

    function withdrawBid(uint256 _auctionId) external auctionExists(_auctionId) {
        Auction storage auction = auctions[_auctionId];
        require(!auction.isActive, "La subasta aun esta activa");
        require(auction.currentBidder == msg.sender, "No eres el pujador actual");
        require(auction.currentBid > 0, "No hay puja para retirar");

        uint256 bidAmount = auction.currentBid;
        auction.currentBid = 0;
        auction.currentBidder = address(0);

        payable(msg.sender).transfer(bidAmount);
    }

    function getUserAuctions(address _user) external view returns (uint256[] memory) {
        return userAuctions[_user];
    }

    function getUserBids(address _user) external view returns (uint256[] memory) {
        return userBids[_user];
    }

    function getAuctionDetails(uint256 _auctionId) external view auctionExists(_auctionId) returns (Auction memory) {
        return auctions[_auctionId];
    }

    function getAuctionBids(uint256 _auctionId) external view auctionExists(_auctionId) returns (Bid[] memory) {
        return auctionBids[_auctionId];
    }

    function setAuctionFeePercentage(uint256 _newPercentage) external onlyOwner {
        require(_newPercentage <= 5, "La comision no puede ser mayor al 5%");
        auctionFeePercentage = _newPercentage;
    }

    function withdrawAuctionFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No hay fondos para retirar");
        
        payable(owner).transfer(balance);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

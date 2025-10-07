// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EscrowService {
    struct Escrow {
        uint256 id;
        address buyer;
        address seller;
        uint256 amount;
        uint256 propertyId;
        bool isActive;
        bool isReleased;
        uint256 createdAt;
        uint256 releaseDate;
    }

    address public owner;
    uint256 public totalEscrows;
    uint256 public escrowFeePercentage = 1; // 1% escrow fee

    mapping(uint256 => Escrow) public escrows;
    mapping(address => uint256[]) public userEscrows;

    event EscrowCreated(uint256 indexed escrowId, address indexed buyer, address indexed seller, uint256 amount);
    event EscrowReleased(uint256 indexed escrowId, address indexed buyer, address indexed seller, uint256 amount);
    event EscrowDisputed(uint256 indexed escrowId, address indexed disputer);
    event EscrowResolved(uint256 indexed escrowId, bool buyerWins);

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede ejecutar esta funcion");
        _;
    }

    modifier escrowExists(uint256 _escrowId) {
        require(_escrowId > 0 && _escrowId <= totalEscrows, "Escrow no existe");
        _;
    }

    modifier onlyEscrowParties(uint256 _escrowId) {
        Escrow storage escrow = escrows[_escrowId];
        require(msg.sender == escrow.buyer || msg.sender == escrow.seller, "No autorizado");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createEscrow(
        address _seller,
        uint256 _propertyId,
        uint256 _releaseDate
    ) external payable returns (uint256) {
        require(_seller != address(0), "Direccion del vendedor invalida");
        require(_seller != msg.sender, "No puedes crear escrow contigo mismo");
        require(msg.value > 0, "El monto debe ser mayor a 0");
        require(_releaseDate > block.timestamp, "La fecha de liberacion debe ser en el futuro");

        totalEscrows++;
        uint256 escrowId = totalEscrows;

        escrows[escrowId] = Escrow({
            id: escrowId,
            buyer: msg.sender,
            seller: _seller,
            amount: msg.value,
            propertyId: _propertyId,
            isActive: true,
            isReleased: false,
            createdAt: block.timestamp,
            releaseDate: _releaseDate
        });

        userEscrows[msg.sender].push(escrowId);
        userEscrows[_seller].push(escrowId);

        emit EscrowCreated(escrowId, msg.sender, _seller, msg.value);
        return escrowId;
    }

    function releaseEscrow(uint256 _escrowId) external escrowExists(_escrowId) onlyEscrowParties(_escrowId) {
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.isActive, "El escrow no esta activo");
        require(escrow.isReleased == false, "El escrow ya fue liberado");
        require(block.timestamp >= escrow.releaseDate, "Aun no es tiempo de liberar el escrow");

        escrow.isActive = false;
        escrow.isReleased = true;

        uint256 escrowFee = (escrow.amount * escrowFeePercentage) / 100;
        uint256 sellerAmount = escrow.amount - escrowFee;

        payable(escrow.seller).transfer(sellerAmount);

        emit EscrowReleased(_escrowId, escrow.buyer, escrow.seller, escrow.amount);
    }

    function disputeEscrow(uint256 _escrowId) external escrowExists(_escrowId) onlyEscrowParties(_escrowId) {
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.isActive, "El escrow no esta activo");
        require(escrow.isReleased == false, "El escrow ya fue liberado");

        emit EscrowDisputed(_escrowId, msg.sender);
    }

    function resolveDispute(uint256 _escrowId, bool _buyerWins) external onlyOwner escrowExists(_escrowId) {
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.isActive, "El escrow no esta activo");
        require(escrow.isReleased == false, "El escrow ya fue liberado");

        escrow.isActive = false;
        escrow.isReleased = true;

        uint256 escrowFee = (escrow.amount * escrowFeePercentage) / 100;
        uint256 recipientAmount = escrow.amount - escrowFee;

        if (_buyerWins) {
            payable(escrow.buyer).transfer(recipientAmount);
        } else {
            payable(escrow.seller).transfer(recipientAmount);
        }

        emit EscrowResolved(_escrowId, _buyerWins);
    }

    function getUserEscrows(address _user) external view returns (uint256[] memory) {
        return userEscrows[_user];
    }

    function getEscrowDetails(uint256 _escrowId) external view escrowExists(_escrowId) returns (Escrow memory) {
        return escrows[_escrowId];
    }

    function setEscrowFeePercentage(uint256 _newPercentage) external onlyOwner {
        require(_newPercentage <= 5, "La comision no puede ser mayor al 5%");
        escrowFeePercentage = _newPercentage;
    }

    function withdrawEscrowFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No hay fondos para retirar");
        
        payable(owner).transfer(balance);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

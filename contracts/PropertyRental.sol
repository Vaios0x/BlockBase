// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PropertyRental {
    struct Property {
        uint256 id;
        address owner;
        string title;
        string description;
        string location;
        uint256 price;
        bool isForSale;
        bool isForRent;
        bool isActive;
        uint256 rentPricePerDay;
        uint256 createdAt;
    }

    struct Rental {
        uint256 propertyId;
        address tenant;
        uint256 startDate;
        uint256 endDate;
        uint256 totalAmount;
        bool isActive;
        bool isPaid;
    }

    struct Sale {
        uint256 propertyId;
        address buyer;
        uint256 salePrice;
        uint256 saleDate;
        bool isCompleted;
    }

    // State variables
    address public owner;
    uint256 public totalProperties;
    uint256 public totalRentals;
    uint256 public totalSales;
    uint256 public platformFeePercentage = 2; // 2% platform fee

    // Mappings
    mapping(uint256 => Property) public properties;
    mapping(uint256 => Rental) public rentals;
    mapping(uint256 => Sale) public sales;
    mapping(address => uint256[]) public userProperties;
    mapping(address => uint256[]) public userRentals;
    mapping(address => uint256[]) public userSales;

    // Events
    event PropertyCreated(uint256 indexed propertyId, address indexed owner, string title);
    event PropertyUpdated(uint256 indexed propertyId, address indexed owner);
    event PropertyRented(uint256 indexed rentalId, uint256 indexed propertyId, address indexed tenant, uint256 startDate, uint256 endDate);
    event PropertySold(uint256 indexed saleId, uint256 indexed propertyId, address indexed buyer, uint256 salePrice);
    event RentalCompleted(uint256 indexed rentalId);
    event SaleCompleted(uint256 indexed saleId);
    event PlatformFeeWithdrawn(address indexed owner, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede ejecutar esta funcion");
        _;
    }

    modifier propertyExists(uint256 _propertyId) {
        require(_propertyId > 0 && _propertyId <= totalProperties, "Propiedad no existe");
        _;
    }

    modifier onlyPropertyOwner(uint256 _propertyId) {
        require(properties[_propertyId].owner == msg.sender, "Solo el propietario de la propiedad puede ejecutar esta accion");
        _;
    }

    modifier propertyActive(uint256 _propertyId) {
        require(properties[_propertyId].isActive, "La propiedad no esta activa");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Crear nueva propiedad
    function createProperty(
        string memory _title,
        string memory _description,
        string memory _location,
        uint256 _price,
        bool _isForSale,
        bool _isForRent,
        uint256 _rentPricePerDay
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "El titulo no puede estar vacio");
        require(_price > 0, "El precio debe ser mayor a 0");
        
        if (_isForRent) {
            require(_rentPricePerDay > 0, "El precio de renta por dia debe ser mayor a 0");
        }

        totalProperties++;
        uint256 propertyId = totalProperties;

        properties[propertyId] = Property({
            id: propertyId,
            owner: msg.sender,
            title: _title,
            description: _description,
            location: _location,
            price: _price,
            isForSale: _isForSale,
            isForRent: _isForRent,
            isActive: true,
            rentPricePerDay: _rentPricePerDay,
            createdAt: block.timestamp
        });

        userProperties[msg.sender].push(propertyId);

        emit PropertyCreated(propertyId, msg.sender, _title);
        return propertyId;
    }

    // Actualizar propiedad
    function updateProperty(
        uint256 _propertyId,
        string memory _title,
        string memory _description,
        string memory _location,
        uint256 _price,
        bool _isForSale,
        bool _isForRent,
        uint256 _rentPricePerDay
    ) external propertyExists(_propertyId) onlyPropertyOwner(_propertyId) {
        require(bytes(_title).length > 0, "El titulo no puede estar vacio");
        require(_price > 0, "El precio debe ser mayor a 0");
        
        if (_isForRent) {
            require(_rentPricePerDay > 0, "El precio de renta por dia debe ser mayor a 0");
        }

        Property storage property = properties[_propertyId];
        property.title = _title;
        property.description = _description;
        property.location = _location;
        property.price = _price;
        property.isForSale = _isForSale;
        property.isForRent = _isForRent;
        property.rentPricePerDay = _rentPricePerDay;

        emit PropertyUpdated(_propertyId, msg.sender);
    }

    // Activar/Desactivar propiedad
    function togglePropertyStatus(uint256 _propertyId) 
        external 
        propertyExists(_propertyId) 
        onlyPropertyOwner(_propertyId) 
    {
        properties[_propertyId].isActive = !properties[_propertyId].isActive;
        emit PropertyUpdated(_propertyId, msg.sender);
    }

    // Rentar propiedad
    function rentProperty(
        uint256 _propertyId,
        uint256 _startDate,
        uint256 _endDate
    ) external payable propertyExists(_propertyId) propertyActive(_propertyId) {
        Property storage property = properties[_propertyId];
        require(property.isForRent, "La propiedad no esta disponible para renta");
        require(property.owner != msg.sender, "No puedes rentar tu propia propiedad");
        require(_startDate >= block.timestamp, "La fecha de inicio debe ser en el futuro");
        require(_endDate > _startDate, "La fecha de fin debe ser posterior a la fecha de inicio");

        uint256 rentalDays = (_endDate - _startDate) / 1 days;
        uint256 totalRentAmount = rentalDays * property.rentPricePerDay;
        uint256 platformFee = (totalRentAmount * platformFeePercentage) / 100;
        uint256 ownerAmount = totalRentAmount - platformFee;

        require(msg.value >= totalRentAmount, "Fondos insuficientes para la renta");

        totalRentals++;
        uint256 rentalId = totalRentals;

        rentals[rentalId] = Rental({
            propertyId: _propertyId,
            tenant: msg.sender,
            startDate: _startDate,
            endDate: _endDate,
            totalAmount: totalRentAmount,
            isActive: true,
            isPaid: true
        });

        userRentals[msg.sender].push(rentalId);

        // Transferir fondos al propietario
        payable(property.owner).transfer(ownerAmount);

        emit PropertyRented(rentalId, _propertyId, msg.sender, _startDate, _endDate);
    }

    // Comprar propiedad
    function buyProperty(uint256 _propertyId) 
        external 
        payable 
        propertyExists(_propertyId) 
        propertyActive(_propertyId) 
    {
        Property storage property = properties[_propertyId];
        require(property.isForSale, "La propiedad no esta disponible para venta");
        require(property.owner != msg.sender, "No puedes comprar tu propia propiedad");
        require(msg.value >= property.price, "Fondos insuficientes para la compra");

        uint256 platformFee = (property.price * platformFeePercentage) / 100;
        uint256 ownerAmount = property.price - platformFee;

        totalSales++;
        uint256 saleId = totalSales;

        sales[saleId] = Sale({
            propertyId: _propertyId,
            buyer: msg.sender,
            salePrice: property.price,
            saleDate: block.timestamp,
            isCompleted: true
        });

        userSales[msg.sender].push(saleId);

        // Transferir propiedad al comprador
        property.owner = msg.sender;
        property.isForSale = false;
        property.isForRent = false;

        // Transferir fondos al propietario anterior
        payable(properties[_propertyId].owner).transfer(ownerAmount);

        emit PropertySold(saleId, _propertyId, msg.sender, property.price);
    }

    // Completar renta
    function completeRental(uint256 _rentalId) external {
        require(_rentalId > 0 && _rentalId <= totalRentals, "Renta no existe");
        Rental storage rental = rentals[_rentalId];
        require(rental.isActive, "La renta ya fue completada");
        require(rental.tenant == msg.sender || properties[rental.propertyId].owner == msg.sender, "No autorizado");

        rental.isActive = false;
        emit RentalCompleted(_rentalId);
    }

    // Obtener propiedades del usuario
    function getUserProperties(address _user) external view returns (uint256[] memory) {
        return userProperties[_user];
    }

    // Obtener rentas del usuario
    function getUserRentals(address _user) external view returns (uint256[] memory) {
        return userRentals[_user];
    }

    // Obtener ventas del usuario
    function getUserSales(address _user) external view returns (uint256[] memory) {
        return userSales[_user];
    }

    // Obtener detalles de propiedad
    function getPropertyDetails(uint256 _propertyId) 
        external 
        view 
        propertyExists(_propertyId) 
        returns (Property memory) 
    {
        return properties[_propertyId];
    }

    // Obtener detalles de renta
    function getRentalDetails(uint256 _rentalId) external view returns (Rental memory) {
        require(_rentalId > 0 && _rentalId <= totalRentals, "Renta no existe");
        return rentals[_rentalId];
    }

    // Obtener detalles de venta
    function getSaleDetails(uint256 _saleId) external view returns (Sale memory) {
        require(_saleId > 0 && _saleId <= totalSales, "Venta no existe");
        return sales[_saleId];
    }

    // Cambiar porcentaje de comisión de la plataforma (solo owner)
    function setPlatformFeePercentage(uint256 _newPercentage) external onlyOwner {
        require(_newPercentage <= 10, "La comision no puede ser mayor al 10%");
        platformFeePercentage = _newPercentage;
    }

    // Retirar comisiones de la plataforma (solo owner)
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No hay fondos para retirar");
        
        payable(owner).transfer(balance);
        emit PlatformFeeWithdrawn(owner, balance);
    }

    // Obtener balance del contrato
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Obtener estadísticas del contrato
    function getContractStats() external view returns (
        uint256 _totalProperties,
        uint256 _totalRentals,
        uint256 _totalSales,
        uint256 _platformFeePercentage,
        uint256 _contractBalance
    ) {
        return (
            totalProperties,
            totalRentals,
            totalSales,
            platformFeePercentage,
            address(this).balance
        );
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PropertyManagement {
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
        uint256 lastMaintenance;
        uint256 maintenanceInterval;
    }

    struct Maintenance {
        uint256 id;
        uint256 propertyId;
        address contractor;
        string description;
        uint256 cost;
        uint256 scheduledDate;
        bool isCompleted;
        bool isPaid;
    }

    struct Tenant {
        address tenant;
        uint256 propertyId;
        uint256 startDate;
        uint256 endDate;
        uint256 rentAmount;
        bool isActive;
    }

    address public owner;
    uint256 public totalProperties;
    uint256 public totalMaintenances;
    uint256 public totalTenants;
    uint256 public managementFeePercentage = 3; // 3% management fee

    mapping(uint256 => Property) public properties;
    mapping(uint256 => Maintenance) public maintenances;
    mapping(uint256 => Tenant) public tenants;
    mapping(address => uint256[]) public userProperties;
    mapping(address => uint256[]) public contractorMaintenances;
    mapping(address => uint256[]) public tenantProperties;

    event PropertyCreated(uint256 indexed propertyId, address indexed owner, string title);
    event MaintenanceScheduled(uint256 indexed maintenanceId, uint256 indexed propertyId, address indexed contractor, uint256 cost);
    event MaintenanceCompleted(uint256 indexed maintenanceId, uint256 indexed propertyId, address indexed contractor);
    event TenantAdded(uint256 indexed tenantId, uint256 indexed propertyId, address indexed tenant, uint256 startDate, uint256 endDate);
    event TenantRemoved(uint256 indexed tenantId, uint256 indexed propertyId, address indexed tenant);
    event PropertyUpdated(uint256 indexed propertyId, address indexed owner);

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

    modifier maintenanceExists(uint256 _maintenanceId) {
        require(_maintenanceId > 0 && _maintenanceId <= totalMaintenances, "Mantenimiento no existe");
        _;
    }

    modifier onlyMaintenanceContractor(uint256 _maintenanceId) {
        require(maintenances[_maintenanceId].contractor == msg.sender, "Solo el contratista puede ejecutar esta accion");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createProperty(
        string memory _title,
        string memory _description,
        string memory _location,
        uint256 _price,
        bool _isForSale,
        bool _isForRent,
        uint256 _rentPricePerDay,
        uint256 _maintenanceInterval
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "El titulo no puede estar vacio");
        require(_price > 0, "El precio debe ser mayor a 0");
        require(_maintenanceInterval > 0, "El intervalo de mantenimiento debe ser mayor a 0");
        
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
            createdAt: block.timestamp,
            lastMaintenance: block.timestamp,
            maintenanceInterval: _maintenanceInterval
        });

        userProperties[msg.sender].push(propertyId);

        emit PropertyCreated(propertyId, msg.sender, _title);
        return propertyId;
    }

    function scheduleMaintenance(
        uint256 _propertyId,
        address _contractor,
        string memory _description,
        uint256 _cost,
        uint256 _scheduledDate
    ) external payable propertyExists(_propertyId) onlyPropertyOwner(_propertyId) {
        require(_contractor != address(0), "Direccion del contratista invalida");
        require(_cost > 0, "El costo debe ser mayor a 0");
        require(_scheduledDate > block.timestamp, "La fecha programada debe ser en el futuro");
        require(msg.value >= _cost, "Fondos insuficientes para el mantenimiento");

        totalMaintenances++;
        uint256 maintenanceId = totalMaintenances;

        maintenances[maintenanceId] = Maintenance({
            id: maintenanceId,
            propertyId: _propertyId,
            contractor: _contractor,
            description: _description,
            cost: _cost,
            scheduledDate: _scheduledDate,
            isCompleted: false,
            isPaid: true
        });

        contractorMaintenances[_contractor].push(maintenanceId);

        emit MaintenanceScheduled(maintenanceId, _propertyId, _contractor, _cost);
    }

    function completeMaintenance(uint256 _maintenanceId) external maintenanceExists(_maintenanceId) onlyMaintenanceContractor(_maintenanceId) {
        Maintenance storage maintenance = maintenances[_maintenanceId];
        require(!maintenance.isCompleted, "El mantenimiento ya fue completado");
        require(block.timestamp >= maintenance.scheduledDate, "Aun no es tiempo de completar el mantenimiento");

        maintenance.isCompleted = true;

        // Transferir pago al contratista
        uint256 managementFee = (maintenance.cost * managementFeePercentage) / 100;
        uint256 contractorAmount = maintenance.cost - managementFee;

        payable(maintenance.contractor).transfer(contractorAmount);

        // Actualizar fecha de ultimo mantenimiento
        properties[maintenance.propertyId].lastMaintenance = block.timestamp;

        emit MaintenanceCompleted(_maintenanceId, maintenance.propertyId, maintenance.contractor);
    }

    function addTenant(
        uint256 _propertyId,
        address _tenant,
        uint256 _startDate,
        uint256 _endDate,
        uint256 _rentAmount
    ) external propertyExists(_propertyId) onlyPropertyOwner(_propertyId) {
        require(_tenant != address(0), "Direccion del inquilino invalida");
        require(_startDate >= block.timestamp, "La fecha de inicio debe ser en el futuro");
        require(_endDate > _startDate, "La fecha de fin debe ser posterior a la fecha de inicio");
        require(_rentAmount > 0, "El monto de renta debe ser mayor a 0");

        totalTenants++;
        uint256 tenantId = totalTenants;

        tenants[tenantId] = Tenant({
            tenant: _tenant,
            propertyId: _propertyId,
            startDate: _startDate,
            endDate: _endDate,
            rentAmount: _rentAmount,
            isActive: true
        });

        tenantProperties[_tenant].push(_propertyId);

        emit TenantAdded(tenantId, _propertyId, _tenant, _startDate, _endDate);
    }

    function removeTenant(uint256 _tenantId) external {
        require(_tenantId > 0 && _tenantId <= totalTenants, "Inquilino no existe");
        Tenant storage tenant = tenants[_tenantId];
        require(tenant.isActive, "El inquilino ya fue removido");
        require(properties[tenant.propertyId].owner == msg.sender, "Solo el propietario puede remover inquilinos");

        tenant.isActive = false;

        emit TenantRemoved(_tenantId, tenant.propertyId, tenant.tenant);
    }

    function updateProperty(
        uint256 _propertyId,
        string memory _title,
        string memory _description,
        string memory _location,
        uint256 _price,
        bool _isForSale,
        bool _isForRent,
        uint256 _rentPricePerDay,
        uint256 _maintenanceInterval
    ) external propertyExists(_propertyId) onlyPropertyOwner(_propertyId) {
        require(bytes(_title).length > 0, "El titulo no puede estar vacio");
        require(_price > 0, "El precio debe ser mayor a 0");
        require(_maintenanceInterval > 0, "El intervalo de mantenimiento debe ser mayor a 0");

        Property storage property = properties[_propertyId];
        property.title = _title;
        property.description = _description;
        property.location = _location;
        property.price = _price;
        property.isForSale = _isForSale;
        property.isForRent = _isForRent;
        property.rentPricePerDay = _rentPricePerDay;
        property.maintenanceInterval = _maintenanceInterval;

        emit PropertyUpdated(_propertyId, msg.sender);
    }

    function getUserProperties(address _user) external view returns (uint256[] memory) {
        return userProperties[_user];
    }

    function getContractorMaintenances(address _contractor) external view returns (uint256[] memory) {
        return contractorMaintenances[_contractor];
    }

    function getTenantProperties(address _tenant) external view returns (uint256[] memory) {
        return tenantProperties[_tenant];
    }

    function getPropertyDetails(uint256 _propertyId) external view propertyExists(_propertyId) returns (Property memory) {
        return properties[_propertyId];
    }

    function getMaintenanceDetails(uint256 _maintenanceId) external view maintenanceExists(_maintenanceId) returns (Maintenance memory) {
        return maintenances[_maintenanceId];
    }

    function getTenantDetails(uint256 _tenantId) external view returns (Tenant memory) {
        require(_tenantId > 0 && _tenantId <= totalTenants, "Inquilino no existe");
        return tenants[_tenantId];
    }

    function setManagementFeePercentage(uint256 _newPercentage) external onlyOwner {
        require(_newPercentage <= 10, "La comision no puede ser mayor al 10%");
        managementFeePercentage = _newPercentage;
    }

    function withdrawManagementFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No hay fondos para retirar");
        
        payable(owner).transfer(balance);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

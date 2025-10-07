// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PropertyInsurance {
    struct InsurancePolicy {
        uint256 id;
        address propertyOwner;
        uint256 propertyId;
        uint256 premium;
        uint256 coverageAmount;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
        bool isClaimed;
        string policyType;
    }

    struct Claim {
        uint256 policyId;
        address claimant;
        uint256 claimAmount;
        string reason;
        bool isApproved;
        bool isProcessed;
        uint256 claimDate;
    }

    address public owner;
    uint256 public totalPolicies;
    uint256 public totalClaims;
    uint256 public insuranceFeePercentage = 5; // 5% insurance fee

    mapping(uint256 => InsurancePolicy) public policies;
    mapping(uint256 => Claim) public claims;
    mapping(address => uint256[]) public userPolicies;
    mapping(address => uint256[]) public userClaims;

    event PolicyCreated(uint256 indexed policyId, address indexed owner, uint256 propertyId, uint256 premium);
    event ClaimSubmitted(uint256 indexed claimId, uint256 indexed policyId, address indexed claimant, uint256 claimAmount);
    event ClaimApproved(uint256 indexed claimId, uint256 indexed policyId, address indexed claimant, uint256 claimAmount);
    event ClaimRejected(uint256 indexed claimId, uint256 indexed policyId, address indexed claimant);
    event PolicyExpired(uint256 indexed policyId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede ejecutar esta funcion");
        _;
    }

    modifier policyExists(uint256 _policyId) {
        require(_policyId > 0 && _policyId <= totalPolicies, "Poliza no existe");
        _;
    }

    modifier onlyPolicyOwner(uint256 _policyId) {
        require(policies[_policyId].propertyOwner == msg.sender, "Solo el propietario de la poliza puede ejecutar esta accion");
        _;
    }

    modifier policyActive(uint256 _policyId) {
        require(policies[_policyId].isActive, "La poliza no esta activa");
        require(block.timestamp <= policies[_policyId].endDate, "La poliza ha expirado");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createPolicy(
        uint256 _propertyId,
        uint256 _coverageAmount,
        uint256 _duration,
        string memory _policyType
    ) external payable returns (uint256) {
        require(_coverageAmount > 0, "El monto de cobertura debe ser mayor a 0");
        require(_duration > 0, "La duracion debe ser mayor a 0");
        require(bytes(_policyType).length > 0, "El tipo de poliza no puede estar vacio");
        require(msg.value > 0, "La prima debe ser mayor a 0");

        totalPolicies++;
        uint256 policyId = totalPolicies;

        policies[policyId] = InsurancePolicy({
            id: policyId,
            propertyOwner: msg.sender,
            propertyId: _propertyId,
            premium: msg.value,
            coverageAmount: _coverageAmount,
            startDate: block.timestamp,
            endDate: block.timestamp + _duration,
            isActive: true,
            isClaimed: false,
            policyType: _policyType
        });

        userPolicies[msg.sender].push(policyId);

        emit PolicyCreated(policyId, msg.sender, _propertyId, msg.value);
        return policyId;
    }

    function submitClaim(
        uint256 _policyId,
        uint256 _claimAmount,
        string memory _reason
    ) external policyExists(_policyId) onlyPolicyOwner(_policyId) {
        InsurancePolicy storage policy = policies[_policyId];
        require(policy.isActive, "La poliza no esta activa");
        require(!policy.isClaimed, "Ya se ha presentado una reclamacion para esta poliza");
        require(_claimAmount > 0, "El monto de la reclamacion debe ser mayor a 0");
        require(_claimAmount <= policy.coverageAmount, "El monto de la reclamacion excede la cobertura");
        require(bytes(_reason).length > 0, "La razon no puede estar vacia");

        totalClaims++;
        uint256 claimId = totalClaims;

        claims[claimId] = Claim({
            policyId: _policyId,
            claimant: msg.sender,
            claimAmount: _claimAmount,
            reason: _reason,
            isApproved: false,
            isProcessed: false,
            claimDate: block.timestamp
        });

        userClaims[msg.sender].push(claimId);
        policy.isClaimed = true;

        emit ClaimSubmitted(claimId, _policyId, msg.sender, _claimAmount);
    }

    function approveClaim(uint256 _claimId) external onlyOwner {
        require(_claimId > 0 && _claimId <= totalClaims, "Reclamacion no existe");
        Claim storage claim = claims[_claimId];
        require(!claim.isProcessed, "La reclamacion ya fue procesada");

        InsurancePolicy storage policy = policies[claim.policyId];
        require(policy.isActive, "La poliza no esta activa");

        claim.isApproved = true;
        claim.isProcessed = true;

        uint256 insuranceFee = (claim.claimAmount * insuranceFeePercentage) / 100;
        uint256 payoutAmount = claim.claimAmount - insuranceFee;

        payable(claim.claimant).transfer(payoutAmount);

        emit ClaimApproved(_claimId, claim.policyId, claim.claimant, claim.claimAmount);
    }

    function rejectClaim(uint256 _claimId) external onlyOwner {
        require(_claimId > 0 && _claimId <= totalClaims, "Reclamacion no existe");
        Claim storage claim = claims[_claimId];
        require(!claim.isProcessed, "La reclamacion ya fue procesada");

        claim.isApproved = false;
        claim.isProcessed = true;

        emit ClaimRejected(_claimId, claim.policyId, claim.claimant);
    }

    function expirePolicy(uint256 _policyId) external policyExists(_policyId) {
        InsurancePolicy storage policy = policies[_policyId];
        require(policy.isActive, "La poliza no esta activa");
        require(block.timestamp > policy.endDate, "La poliza aun no ha expirado");

        policy.isActive = false;
        emit PolicyExpired(_policyId);
    }

    function getUserPolicies(address _user) external view returns (uint256[] memory) {
        return userPolicies[_user];
    }

    function getUserClaims(address _user) external view returns (uint256[] memory) {
        return userClaims[_user];
    }

    function getPolicyDetails(uint256 _policyId) external view policyExists(_policyId) returns (InsurancePolicy memory) {
        return policies[_policyId];
    }

    function getClaimDetails(uint256 _claimId) external view returns (Claim memory) {
        require(_claimId > 0 && _claimId <= totalClaims, "Reclamacion no existe");
        return claims[_claimId];
    }

    function setInsuranceFeePercentage(uint256 _newPercentage) external onlyOwner {
        require(_newPercentage <= 10, "La comision no puede ser mayor al 10%");
        insuranceFeePercentage = _newPercentage;
    }

    function withdrawInsuranceFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No hay fondos para retirar");
        
        payable(owner).transfer(balance);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

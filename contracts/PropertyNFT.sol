// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct PropertyMetadata {
        string title;
        string description;
        string location;
        uint256 price;
        uint256 area;
        uint256 bedrooms;
        uint256 bathrooms;
        string propertyType;
        uint256 createdAt;
    }

    mapping(uint256 => PropertyMetadata) public propertyMetadata;
    mapping(address => uint256[]) public userProperties;

    event PropertyMinted(uint256 indexed tokenId, address indexed owner, string title);
    event PropertyMetadataUpdated(uint256 indexed tokenId, string title);

    constructor() ERC721("RealEstateProperty", "REP") Ownable(msg.sender) {}

    function mintProperty(
        address to,
        string memory uri,
        PropertyMetadata memory metadata
    ) public onlyOwner returns (uint256) {
        require(bytes(metadata.title).length > 0, "El titulo no puede estar vacio");
        require(metadata.price > 0, "El precio debe ser mayor a 0");
        require(metadata.area > 0, "El area debe ser mayor a 0");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        propertyMetadata[tokenId] = metadata;
        userProperties[to].push(tokenId);

        emit PropertyMinted(tokenId, to, metadata.title);
        return tokenId;
    }

    function updatePropertyMetadata(
        uint256 tokenId,
        PropertyMetadata memory metadata
    ) public {
        require(_isAuthorized(_ownerOf(tokenId), msg.sender, tokenId), "No autorizado");
        require(bytes(metadata.title).length > 0, "El titulo no puede estar vacio");
        require(metadata.price > 0, "El precio debe ser mayor a 0");

        propertyMetadata[tokenId] = metadata;
        emit PropertyMetadataUpdated(tokenId, metadata.title);
    }

    function getUserProperties(address user) public view returns (uint256[] memory) {
        return userProperties[user];
    }

    function getPropertyMetadata(uint256 tokenId) public view returns (PropertyMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Token no existe");
        return propertyMetadata[tokenId];
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    // Override required by Solidity
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

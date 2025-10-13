# 🔧 Troubleshooting Guide - BlockBase

## 🚨 Common Issues & Solutions

### Wallet Connection Issues

#### Problem: "User rejected the request"
**Solution:**
1. Ensure MetaMask is unlocked
2. Check if you're on the correct network (Base Sepolia)
3. Try refreshing the page
4. Clear browser cache and cookies

#### Problem: "Unsupported chain"
**Solution:**
```javascript
// Add Base Sepolia to MetaMask
const baseSepolia = {
  chainId: '0x14A34', // 84532 in hex
  chainName: 'Base Sepolia',
  rpcUrls: ['https://sepolia.base.org'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  blockExplorerUrls: ['https://sepolia.basescan.org']
}
```

#### Problem: Wallet not detected
**Solution:**
1. Install MetaMask extension
2. Enable "Use MetaMask" in browser settings
3. Check if popup blockers are enabled
4. Try different browser

### Smart Contract Issues

#### Problem: "Transaction failed"
**Possible Causes:**
- Insufficient gas
- Contract not deployed
- Wrong network
- Invalid parameters

**Solutions:**
```bash
# Check contract deployment
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>

# Check gas estimation
const gasEstimate = await contract.method.estimateGas(params)
console.log('Gas estimate:', gasEstimate)
```

#### Problem: "Contract not found"
**Solution:**
1. Verify contract address is correct
2. Check if contract is deployed on current network
3. Ensure ABI matches contract version
4. Check BaseScan for contract verification

### Frontend Issues

#### Problem: Build fails with TypeScript errors
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm build
```

#### Problem: Styling not applied
**Solution:**
1. Check if Tailwind CSS is properly configured
2. Ensure classes are not purged in production
3. Check for CSS conflicts
4. Verify PostCSS configuration

#### Problem: Images not loading
**Solution:**
```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority // for above-the-fold images
/>
```

### Performance Issues

#### Problem: Slow page load
**Solutions:**
1. Enable code splitting
2. Use dynamic imports for heavy components
3. Optimize images (WebP, AVIF)
4. Implement lazy loading

```typescript
// Lazy load components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})
```

#### Problem: High memory usage
**Solutions:**
1. Use React.memo for expensive components
2. Implement proper cleanup in useEffect
3. Avoid memory leaks in event listeners
4. Use useCallback and useMemo appropriately

### Network Issues

#### Problem: RPC connection failed
**Solution:**
```typescript
// Use multiple RPC endpoints
const rpcUrls = [
  'https://sepolia.base.org',
  'https://base-sepolia.g.alchemy.com/v2/YOUR_KEY',
  'https://base-sepolia.infura.io/v3/YOUR_KEY'
]
```

#### Problem: Slow transaction confirmation
**Solutions:**
1. Increase gas price
2. Use multiple RPC providers
3. Implement retry logic
4. Show loading states

### Development Issues

#### Problem: Hot reload not working
**Solution:**
```bash
# Restart development server
pnpm dev

# Clear Next.js cache
rm -rf .next
pnpm dev
```

#### Problem: ESLint errors
**Solution:**
```bash
# Fix auto-fixable issues
pnpm lint --fix

# Check specific file
pnpm lint src/components/YourComponent.tsx
```

#### Problem: TypeScript compilation errors
**Solution:**
```bash
# Type check
pnpm type-check

# Generate types
pnpm types:generate
```

## 🐛 Debugging Tools

### Browser DevTools
```javascript
// Console debugging
console.log('Debug info:', { data, error })

// Network tab
// Check for failed requests
// Monitor WebSocket connections
// Analyze bundle size
```

### React DevTools
- Component tree inspection
- Props and state debugging
- Performance profiling
- Hook debugging

### Blockchain Debugging
```javascript
// Check transaction status
const receipt = await provider.getTransactionReceipt(txHash)
console.log('Transaction receipt:', receipt)

// Check contract state
const contract = new ethers.Contract(address, abi, provider)
const state = await contract.getState()
console.log('Contract state:', state)
```

## 🔍 Error Codes Reference

### Wallet Errors
- `4001`: User rejected request
- `4100`: Unauthorized
- `4200`: Unsupported method
- `4900`: Disconnected

### Contract Errors
- `0x08c379a0`: Revert with reason
- `0x4e487b71`: Panic error
- `0x4e487b72`: Arithmetic overflow

### Network Errors
- `NETWORK_ERROR`: Network connection failed
- `TIMEOUT`: Request timeout
- `INVALID_RESPONSE`: Invalid JSON response

## 📞 Getting Help

### Community Support
- **Discord**: [BlockBase Discord](https://discord.gg/blockbase)
- **GitHub Issues**: [Report bugs](https://github.com/Vaios0x/BlockBase/issues)
- **Twitter**: [@BlockBase](https://twitter.com/blockbase)

### Documentation
- **API Reference**: `/docs/API_REFERENCE.md`
- **Development Guide**: `/docs/DEVELOPMENT_GUIDE.md`
- **Smart Contracts**: `/contracts/README.md`

### Logs and Monitoring
```bash
# Enable debug logging
DEBUG=blockbase:* pnpm dev

# Check application logs
tail -f logs/app.log

# Monitor performance
pnpm analyze
```

## 🚀 Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
pnpm analyze

# Check for duplicate dependencies
pnpm why <package-name>
```

### Memory Profiling
```javascript
// Monitor memory usage
if (performance.memory) {
  console.log('Memory usage:', {
    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
    limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
  })
}
```

### Network Optimization
```typescript
// Implement request caching
const cache = new Map()

const cachedFetch = async (url: string) => {
  if (cache.has(url)) {
    return cache.get(url)
  }
  
  const response = await fetch(url)
  cache.set(url, response)
  return response
}
```

## 🔒 Security Checklist

### Before Deployment
- [ ] All environment variables secured
- [ ] No hardcoded private keys
- [ ] Input validation implemented
- [ ] Error messages don't expose sensitive data
- [ ] HTTPS enabled in production
- [ ] Security headers configured
- [ ] Dependencies updated
- [ ] Security audit passed

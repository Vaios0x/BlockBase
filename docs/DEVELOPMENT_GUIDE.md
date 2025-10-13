# 🛠️ Development Guide - BlockBase

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PNPM 8+
- Git
- MetaMask o wallet compatible

### Installation
```bash
# Clone repository
git clone https://github.com/Vaios0x/BlockBase.git
cd BlockBase

# Install dependencies
pnpm install

# Start development server
cd frontend-next
pnpm dev
```

## 🏗️ Project Structure

```
BlockBase/
├── contracts/                 # Smart contracts
│   ├── PropertyRental.sol
│   ├── PropertyNFT.sol
│   └── ...
├── frontend-next/            # Next.js frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   ├── public/             # Static assets
│   └── docs/              # Documentation
├── scripts/               # Deployment scripts
└── docs/                 # Project documentation
```

## 🔧 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# ... your code changes ...

# Commit changes
git add .
git commit -m "feat: your feature description"

# Push branch
git push origin feature/your-feature-name

# Create Pull Request
```

### 2. Code Quality
```bash
# Lint code
pnpm lint

# Type check
pnpm type-check

# Format code
pnpm format

# Run tests
pnpm test
```

### 3. Testing
```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test PropertyList.test.tsx

# Run tests in watch mode
pnpm test:watch
```

## 🎨 Component Development

### Creating Components
```typescript
// src/components/YourComponent.tsx
'use client'

import { cn } from '@/utils/cn'

interface YourComponentProps {
  className?: string
  children?: React.ReactNode
}

export default function YourComponent({ 
  className, 
  children 
}: YourComponentProps) {
  return (
    <div className={cn('base-classes', className)}>
      {children}
    </div>
  )
}
```

### Component Guidelines
- Use TypeScript interfaces for props
- Include `className` prop for styling flexibility
- Use `cn` utility for conditional classes
- Add proper accessibility attributes
- Include JSDoc comments for complex components

## 🔗 Smart Contract Integration

### Contract Configuration
```typescript
// src/config/contracts.ts
export const CONTRACTS = {
  PropertyRental: '0x7094f1eb1c49Cf89B793844CecE4baE655f3359b',
  PropertyNFT: '0x51FBdDcD12704e4FCc28880E22b582362811cCdf',
  // ... other contracts
}
```

### Using Contracts
```typescript
// src/hooks/useContracts.ts
import { useContractRead, useContractWrite } from 'wagmi'

export function usePropertyRental() {
  const { data: properties } = useContractRead({
    address: CONTRACTS.PropertyRental,
    abi: PropertyRentalABI,
    functionName: 'getAllProperties'
  })

  const { write: createProperty } = useContractWrite({
    address: CONTRACTS.PropertyRental,
    abi: PropertyRentalABI,
    functionName: 'createProperty'
  })

  return { properties, createProperty }
}
```

## 🎯 Best Practices

### Code Style
- Use functional components with hooks
- Prefer TypeScript over JavaScript
- Use meaningful variable and function names
- Keep components small and focused
- Use custom hooks for complex logic

### Performance
- Use `React.memo` for expensive components
- Implement lazy loading for large components
- Use `useCallback` and `useMemo` appropriately
- Optimize images and assets
- Monitor bundle size

### Accessibility
- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast ratios

### Security
- Validate all user inputs
- Sanitize data before rendering
- Use HTTPS in production
- Implement proper error handling
- Keep dependencies updated

## 🧪 Testing Strategy

### Unit Tests
```typescript
// src/components/__tests__/YourComponent.test.tsx
import { render, screen } from '@testing-library/react'
import YourComponent from '../YourComponent'

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Integration Tests
```typescript
// src/__tests__/integration/PropertyFlow.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

describe('Property Flow', () => {
  it('allows user to create and rent property', async () => {
    // Test implementation
  })
})
```

## 🚀 Deployment

### Environment Setup
```bash
# Production
NEXT_PUBLIC_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org

# Development
NEXT_PUBLIC_PROJECT_ID=your_dev_project_id
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
```

### Build Process
```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Analyze bundle
pnpm analyze
```

## 🔍 Debugging

### Common Issues
1. **Wallet Connection**: Ensure MetaMask is installed and unlocked
2. **Network Issues**: Check if you're on Base Sepolia
3. **Contract Errors**: Verify contract addresses and ABI
4. **Build Errors**: Clear `.next` folder and reinstall dependencies

### Debug Tools
- React Developer Tools
- Redux DevTools
- Network tab in browser
- Console logs for debugging

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Wagmi Docs](https://wagmi.sh)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

### Tools
- [Vercel](https://vercel.com) - Deployment
- [BaseScan](https://sepolia.basescan.org) - Block Explorer
- [MetaMask](https://metamask.io) - Wallet
- [Hardhat](https://hardhat.org) - Smart Contract Development

## 🤝 Contributing

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit pull request

### Code Review Checklist
- [ ] Code follows project conventions
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Accessibility considerations
- [ ] Performance impact assessed

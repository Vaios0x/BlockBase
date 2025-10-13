/**
 * Security utilities for BlockBase
 * Advanced security measures and validation
 */

export interface SecurityConfig {
  enableCSP: boolean
  enableHSTS: boolean
  enableXSSProtection: boolean
  enableClickjackingProtection: boolean
  enableMimeSniffingProtection: boolean
  allowedOrigins: string[]
  maxRequestSize: number
  rateLimitWindow: number
  rateLimitMax: number
}

export interface SecurityHeaders {
  'Content-Security-Policy': string
  'Strict-Transport-Security': string
  'X-Content-Type-Options': string
  'X-Frame-Options': string
  'X-XSS-Protection': string
  'Referrer-Policy': string
  'Permissions-Policy': string
}

export class SecurityManager {
  private config: SecurityConfig
  private requestCounts = new Map<string, { count: number; resetTime: number }>()

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = {
      enableCSP: true,
      enableHSTS: true,
      enableXSSProtection: true,
      enableClickjackingProtection: true,
      enableMimeSniffingProtection: true,
      allowedOrigins: ['https://blockbase.app', 'https://sepolia.basescan.org'],
      maxRequestSize: 10 * 1024 * 1024, // 10MB
      rateLimitWindow: 15 * 60 * 1000, // 15 minutes
      rateLimitMax: 100,
      ...config
    }
  }

  // Generate security headers
  generateSecurityHeaders(): SecurityHeaders {
    const headers: Partial<SecurityHeaders> = {}

    if (this.config.enableCSP) {
      headers['Content-Security-Policy'] = this.generateCSP()
    }

    if (this.config.enableHSTS) {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
    }

    if (this.config.enableXSSProtection) {
      headers['X-XSS-Protection'] = '1; mode=block'
    }

    if (this.config.enableClickjackingProtection) {
      headers['X-Frame-Options'] = 'DENY'
    }

    if (this.config.enableMimeSniffingProtection) {
      headers['X-Content-Type-Options'] = 'nosniff'
    }

    headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    headers['Permissions-Policy'] = this.generatePermissionsPolicy()

    return headers as SecurityHeaders
  }

  // Generate Content Security Policy
  private generateCSP(): string {
    const directives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://sepolia.base.org https://sepolia.basescan.org wss:",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ]

    return directives.join('; ')
  }

  // Generate Permissions Policy
  private generatePermissionsPolicy(): string {
    const permissions = [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()'
    ]

    return permissions.join(', ')
  }

  // Validate input
  validateInput(input: string, type: 'email' | 'url' | 'address' | 'text'): boolean {
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
      case 'url':
        try {
          new URL(input)
          return true
        } catch {
          return false
        }
      case 'address':
        return /^0x[a-fA-F0-9]{40}$/.test(input)
      case 'text':
        return input.length > 0 && input.length < 1000
      default:
        return false
    }
  }

  // Sanitize HTML
  sanitizeHTML(html: string): string {
    const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li']
    const allowedAttributes = ['href', 'target', 'rel']
    
    // Simple HTML sanitization (in production, use a library like DOMPurify)
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '')
  }

  // Rate limiting
  checkRateLimit(identifier: string): boolean {
    const now = Date.now()
    const userData = this.requestCounts.get(identifier)

    if (!userData || now > userData.resetTime) {
      this.requestCounts.set(identifier, {
        count: 1,
        resetTime: now + this.config.rateLimitWindow
      })
      return true
    }

    if (userData.count >= this.config.rateLimitMax) {
      return false
    }

    userData.count++
    return true
  }

  // Validate file upload
  validateFileUpload(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.config.maxRequestSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${this.config.maxRequestSize / 1024 / 1024}MB`
      }
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only images are allowed.'
      }
    }

    // Check file name
    if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
      return {
        valid: false,
        error: 'Invalid file name. Only alphanumeric characters, dots, underscores, and hyphens are allowed.'
      }
    }

    return { valid: true }
  }

  // Generate secure random string
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    
    return result
  }

  // Hash sensitive data
  async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // Validate wallet signature
  async validateWalletSignature(
    message: string,
    signature: string,
    address: string
  ): Promise<boolean> {
    try {
      // This is a simplified validation
      // In production, use proper signature verification
      return signature.length === 132 && address.startsWith('0x')
    } catch (error) {
      console.error('Signature validation error:', error)
      return false
    }
  }

  // Check for suspicious activity
  detectSuspiciousActivity(activity: {
    userAgent: string
    ip: string
    actions: string[]
    timestamp: number
  }): { suspicious: boolean; reasons: string[] } {
    const reasons: string[] = []

    // Check for bot-like behavior
    if (activity.userAgent.includes('bot') || activity.userAgent.includes('crawler')) {
      reasons.push('Bot-like user agent')
    }

    // Check for rapid actions
    const rapidActions = activity.actions.filter((action, index) => {
      return index > 0 && activity.actions[index - 1] === action
    })

    if (rapidActions.length > 5) {
      reasons.push('Rapid repeated actions')
    }

    // Check for suspicious IP patterns
    if (activity.ip.includes('127.0.0.1') || activity.ip.includes('localhost')) {
      reasons.push('Localhost IP address')
    }

    return {
      suspicious: reasons.length > 0,
      reasons
    }
  }

  // Encrypt sensitive data
  async encryptData(data: string, key: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const keyBuffer = encoder.encode(key)

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    )

    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      dataBuffer
    )

    const result = new Uint8Array(iv.length + encrypted.byteLength)
    result.set(iv)
    result.set(new Uint8Array(encrypted), iv.length)

    return btoa(String.fromCharCode(...result))
  }

  // Decrypt sensitive data
  async decryptData(encryptedData: string, key: string): Promise<string> {
    const decoder = new TextDecoder()
    const dataBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))
    const keyBuffer = new TextEncoder().encode(key)

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    )

    const iv = dataBuffer.slice(0, 12)
    const encrypted = dataBuffer.slice(12)

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    )

    return decoder.decode(decrypted)
  }
}

// Export singleton instance
export const securityManager = new SecurityManager()

// React hook for security
export function useSecurity() {
  return {
    validateInput: securityManager.validateInput.bind(securityManager),
    sanitizeHTML: securityManager.sanitizeHTML.bind(securityManager),
    checkRateLimit: securityManager.checkRateLimit.bind(securityManager),
    validateFileUpload: securityManager.validateFileUpload.bind(securityManager),
    generateSecureToken: securityManager.generateSecureToken.bind(securityManager),
    hashData: securityManager.hashData.bind(securityManager),
    validateWalletSignature: securityManager.validateWalletSignature.bind(securityManager),
    detectSuspiciousActivity: securityManager.detectSuspiciousActivity.bind(securityManager),
    encryptData: securityManager.encryptData.bind(securityManager),
    decryptData: securityManager.decryptData.bind(securityManager)
  }
}

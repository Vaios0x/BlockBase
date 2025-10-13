/**
 * Analytics utilities for BlockBase
 * Comprehensive tracking and analytics system
 */

export interface AnalyticsEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  properties?: Record<string, any>
  timestamp: number
  userId?: string
  sessionId: string
}

export interface UserProperties {
  walletAddress?: string
  chainId?: number
  userAgent: string
  language: string
  timezone: string
  screenResolution: string
  viewportSize: string
}

class AnalyticsManager {
  private events: AnalyticsEvent[] = []
  private sessionId: string
  private userId?: string
  private userProperties: UserProperties
  private isEnabled: boolean = true

  constructor() {
    this.sessionId = this.generateSessionId()
    this.userProperties = this.getUserProperties()
    this.setupPageTracking()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getUserProperties(): UserProperties {
    if (typeof window === 'undefined') {
      return {
        userAgent: '',
        language: '',
        timezone: '',
        screenResolution: '',
        viewportSize: ''
      }
    }

    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`
    }
  }

  private setupPageTracking(): void {
    if (typeof window === 'undefined') return

    // Track page views
    this.track('page_view', 'navigation', 'view', window.location.pathname)

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden', 'engagement', 'visibility_change')
      } else {
        this.track('page_visible', 'engagement', 'visibility_change')
      }
    })

    // Track scroll depth
    let maxScrollDepth = 0
    const trackScrollDepth = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth
        this.track('scroll_depth', 'engagement', 'scroll', undefined, scrollDepth)
      }
    }

    window.addEventListener('scroll', this.throttle(trackScrollDepth, 1000))
  }

  private throttle(func: Function, limit: number) {
    let inThrottle: boolean
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // Core tracking methods
  track(
    event: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    properties?: Record<string, any>
  ): void {
    if (!this.isEnabled) return

    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      action,
      label,
      value,
      properties: {
        ...properties,
        ...this.userProperties
      },
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId
    }

    this.events.push(analyticsEvent)
    this.sendEvent(analyticsEvent)
  }

  // User identification
  identify(userId: string, properties?: Record<string, any>): void {
    this.userId = userId
    this.track('user_identified', 'user', 'identify', userId, undefined, properties)
  }

  // Wallet connection tracking
  trackWalletConnection(walletType: string, chainId: number): void {
    this.track('wallet_connected', 'wallet', 'connect', walletType, chainId, {
      walletType,
      chainId
    })
  }

  // Property interactions
  trackPropertyView(propertyId: string, propertyName: string): void {
    this.track('property_viewed', 'property', 'view', propertyName, undefined, {
      propertyId,
      propertyName
    })
  }

  trackPropertyCreate(propertyData: Record<string, any>): void {
    this.track('property_created', 'property', 'create', undefined, undefined, propertyData)
  }

  trackPropertyRent(propertyId: string, rentAmount: number): void {
    this.track('property_rented', 'property', 'rent', propertyId, rentAmount, {
      propertyId,
      rentAmount
    })
  }

  // Transaction tracking
  trackTransaction(
    txHash: string,
    type: 'create_property' | 'rent_property' | 'cancel_rent',
    amount?: number,
    gasUsed?: number
  ): void {
    this.track('transaction_initiated', 'blockchain', 'transaction', type, amount, {
      txHash,
      type,
      amount,
      gasUsed
    })
  }

  trackTransactionSuccess(txHash: string, gasUsed: number, blockNumber: number): void {
    this.track('transaction_success', 'blockchain', 'success', txHash, gasUsed, {
      txHash,
      gasUsed,
      blockNumber
    })
  }

  trackTransactionFailure(txHash: string, error: string): void {
    this.track('transaction_failure', 'blockchain', 'failure', txHash, undefined, {
      txHash,
      error
    })
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.track('performance_metric', 'performance', 'measure', metric, value, {
      metric,
      value,
      unit
    })
  }

  // Error tracking
  trackError(error: Error, context?: string): void {
    this.track('error_occurred', 'error', 'exception', error.message, undefined, {
      errorMessage: error.message,
      errorStack: error.stack,
      context
    })
  }

  // User engagement
  trackEngagement(action: string, duration?: number): void {
    this.track('user_engagement', 'engagement', action, undefined, duration)
  }

  // Feature usage
  trackFeatureUsage(feature: string, action: string): void {
    this.track('feature_used', 'feature', action, feature)
  }

  // Search tracking
  trackSearch(query: string, results: number): void {
    this.track('search_performed', 'search', 'query', query, results, {
      query,
      results
    })
  }

  // Filter tracking
  trackFilter(filterType: string, filterValue: string): void {
    this.track('filter_applied', 'filter', 'apply', filterType, undefined, {
      filterType,
      filterValue
    })
  }

  // Private method to send events (implement based on your analytics provider)
  private sendEvent(event: AnalyticsEvent): void {
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_map: event.properties
      })
    }

    // Example: Send to custom analytics endpoint
    if (typeof fetch !== 'undefined') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      }).catch(error => {
        console.warn('Failed to send analytics event:', error)
      })
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event)
    }
  }

  // Get analytics data
  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  getSessionId(): string {
    return this.sessionId
  }

  getUserProperties(): UserProperties {
    return { ...this.userProperties }
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  // Clear analytics data
  clear(): void {
    this.events = []
  }
}

// Singleton instance
export const analytics = new AnalyticsManager()

// React hook for analytics
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    identify: analytics.identify.bind(analytics),
    trackWalletConnection: analytics.trackWalletConnection.bind(analytics),
    trackPropertyView: analytics.trackPropertyView.bind(analytics),
    trackPropertyCreate: analytics.trackPropertyCreate.bind(analytics),
    trackPropertyRent: analytics.trackPropertyRent.bind(analytics),
    trackTransaction: analytics.trackTransaction.bind(analytics),
    trackTransactionSuccess: analytics.trackTransactionSuccess.bind(analytics),
    trackTransactionFailure: analytics.trackTransactionFailure.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackEngagement: analytics.trackEngagement.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackFilter: analytics.trackFilter.bind(analytics),
    getEvents: analytics.getEvents.bind(analytics),
    getSessionId: analytics.getSessionId.bind(analytics),
    getUserProperties: analytics.getUserProperties.bind(analytics),
    setEnabled: analytics.setEnabled.bind(analytics),
    clear: analytics.clear.bind(analytics)
  }
}

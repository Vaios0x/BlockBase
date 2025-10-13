'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/utils/cn'
import { collectPerformanceMetrics, checkPerformanceBudget, measureWebVitals } from '@/utils/performance'

interface PerformanceData {
  fcp: number
  lcp: number
  fid: number
  cls: number
  memory: {
    used: number
    total: number
    limit: number
    percentage: number
  } | null
  score: number
  violations: string[]
}

interface PerformanceMonitorProps {
  className?: string
  showDetails?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

export default function PerformanceMonitor({ 
  className, 
  showDetails = false,
  autoRefresh = false,
  refreshInterval = 5000
}: PerformanceMonitorProps) {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [history, setHistory] = useState<PerformanceData[]>([])

  const updatePerformanceData = useCallback(() => {
    const metrics = collectPerformanceMetrics()
    if (!metrics) return

    const budget = checkPerformanceBudget(metrics)
    
    const data: PerformanceData = {
      fcp: metrics.fcp,
      lcp: metrics.lcp,
      fid: metrics.fid,
      cls: metrics.cls,
      memory: metrics.memory,
      score: budget.score,
      violations: budget.violations
    }

    setPerformanceData(data)
    setHistory(prev => [...prev.slice(-9), data]) // Keep last 10 entries
  }, [])

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
    
    // Measure Web Vitals
    measureWebVitals((metric) => {
      console.log('Web Vital:', metric)
    })

    // Initial measurement
    updatePerformanceData()

    // Auto refresh if enabled
    if (autoRefresh) {
      const interval = setInterval(updatePerformanceData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [updatePerformanceData, autoRefresh, refreshInterval])

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excelente'
    if (score >= 70) return 'Bueno'
    if (score >= 50) return 'Regular'
    return 'Necesita mejora'
  }

  useEffect(() => {
    const cleanup = startMonitoring()
    return cleanup
  }, [startMonitoring])

  if (!performanceData) {
    return (
      <div className={cn('p-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md', className)}>
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
          <span className="text-gray-400">Cargando métricas de rendimiento...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">Monitor de Rendimiento</h3>
          <div className={cn(
            'w-2 h-2 rounded-full',
            isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
          )} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={cn(
              'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
              isMonitoring
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            )}
          >
            {isMonitoring ? 'Detener' : 'Iniciar'}
          </button>
          <button
            onClick={updatePerformanceData}
            className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md">
          <div className="text-center">
            <div className={cn('text-3xl font-bold', getScoreColor(performanceData.score))}>
              {performanceData.score}
            </div>
            <div className="text-sm text-gray-400">Puntuación</div>
            <div className="text-xs text-gray-500 mt-1">
              {getScoreLabel(performanceData.score)}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {performanceData.fcp.toFixed(0)}ms
            </div>
            <div className="text-sm text-gray-400">First Contentful Paint</div>
            <div className={cn(
              'text-xs mt-1',
              performanceData.fcp < 1800 ? 'text-green-400' : 'text-red-400'
            )}>
              {performanceData.fcp < 1800 ? '✅ Bueno' : '⚠️ Lento'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {performanceData.memory ? `${performanceData.memory.used}MB` : 'N/A'}
            </div>
            <div className="text-sm text-gray-400">Memoria Usada</div>
            <div className={cn(
              'text-xs mt-1',
              performanceData.memory && performanceData.memory.used < 50 ? 'text-green-400' : 'text-yellow-400'
            )}>
              {performanceData.memory && performanceData.memory.used < 50 ? '✅ Óptimo' : '⚠️ Alto uso'}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      {showDetails && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg border border-white/10 bg-white/5">
            <div className="text-lg font-semibold text-blue-400">
              {performanceData.lcp.toFixed(0)}ms
            </div>
            <div className="text-xs text-gray-400">LCP</div>
          </div>
          <div className="p-3 rounded-lg border border-white/10 bg-white/5">
            <div className="text-lg font-semibold text-green-400">
              {performanceData.fid.toFixed(0)}ms
            </div>
            <div className="text-xs text-gray-400">FID</div>
          </div>
          <div className="p-3 rounded-lg border border-white/10 bg-white/5">
            <div className="text-lg font-semibold text-yellow-400">
              {performanceData.cls.toFixed(3)}
            </div>
            <div className="text-xs text-gray-400">CLS</div>
          </div>
          <div className="p-3 rounded-lg border border-white/10 bg-white/5">
            <div className="text-lg font-semibold text-red-400">
              {performanceData.violations.length}
            </div>
            <div className="text-xs text-gray-400">Violaciones</div>
          </div>
        </div>
      )}

      {/* Violations */}
      {performanceData.violations.length > 0 && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur-md">
          <h4 className="text-sm font-medium text-red-400 mb-2">Violaciones de Presupuesto</h4>
          <ul className="space-y-1">
            {performanceData.violations.map((violation, index) => (
              <li key={index} className="text-xs text-red-300 flex items-center gap-2">
                <i className="fas fa-exclamation-triangle" />
                {violation}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* History Chart */}
      {history.length > 1 && (
        <div className="p-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md">
          <h4 className="text-sm font-medium text-white mb-3">Historial de Puntuación</h4>
          <div className="flex items-end gap-1 h-20">
            {history.map((entry, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                style={{ height: `${(entry.score / 100) * 100}%` }}
                title={`Puntuación: ${entry.score}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

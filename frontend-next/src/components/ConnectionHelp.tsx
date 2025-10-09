'use client'

import { useState } from 'react'
import NeuralButton from './NeuralButton'

export default function ConnectionHelp() {
  const [isOpen, setIsOpen] = useState(false)

  const commonIssues = [
    {
      title: "Usuario rechazó la conexión",
      description: "El usuario canceló la conexión en su wallet",
      solution: "Intenta conectar nuevamente y acepta la solicitud en tu wallet"
    },
    {
      title: "Wallet no detectado",
      description: "No se encontró MetaMask u otro wallet",
      solution: "Instala MetaMask o habilita la extensión en tu navegador"
    },
    {
      title: "Red incorrecta",
      description: "Tu wallet está en una red diferente",
      solution: "Cambia a Base Sepolia en tu wallet o usa el botón 'Cambiar Red'"
    },
    {
      title: "Transacción fallida",
      description: "La transacción fue rechazada o falló",
      solution: "Verifica que tienes suficiente ETH para gas y que la red es correcta"
    }
  ]

  return (
    <div className="relative">
      <NeuralButton
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <i className="fas fa-question-circle"></i>
        Ayuda
      </NeuralButton>

      {isOpen && (
        <div className="absolute top-12 right-0 w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 z-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Solución de Problemas</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-3">
              {commonIssues.map((issue, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-sm font-semibold text-white mb-1">{issue.title}</h4>
                  <p className="text-xs text-gray-300 mb-2">{issue.description}</p>
                  <p className="text-xs text-cyan-400">{issue.solution}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10">
              <div className="text-xs text-gray-400 space-y-1">
                <p><i className="fas fa-info-circle mr-2"></i>Red: Base Sepolia (Chain ID: 84532)</p>
                <p><i className="fas fa-link mr-2"></i>RPC: https://sepolia.base.org</p>
                <p><i className="fas fa-external-link-alt mr-2"></i>Explorer: BaseScan</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

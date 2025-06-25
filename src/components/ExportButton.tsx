import React from 'react'
import { Download } from 'lucide-react'
import { exportAllData } from '../utils/localStorage'

interface ExportButtonProps {
  disabled?: boolean
  className?: string
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  disabled = false, 
  className = '' 
}) => {
  const handleExport = () => {
    try {
      exportAllData()
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      alert('Erro ao exportar dados. Tente novamente.')
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={disabled}
      className={`btn-secondary flex items-center space-x-2 ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title="Exportar todos os dados como backup JSON"
    >
      <Download className="h-4 w-4" />
      <span>Exportar Dados</span>
    </button>
  )
}

export default ExportButton
import React from 'react'
import { Conflito } from '../types'
import { AlertTriangle, AlertCircle, XCircle } from 'lucide-react'

interface ConflictListProps {
  conflicts: Conflito[]
}

const ConflictList: React.FC<ConflictListProps> = ({ conflicts }) => {
  if (conflicts.length === 0) {
    return (
      <div className="card bg-green-50 border-green-200">
        <div className="flex items-center space-x-2 text-green-700">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            ✓
          </div>
          <div>
            <h3 className="font-semibold">Grade Gerada com Sucesso!</h3>
            <p className="text-sm text-green-600">Nenhum conflito encontrado.</p>
          </div>
        </div>
      </div>
    )
  }

  const getConflictIcon = (tipo: Conflito['tipo']) => {
    switch (tipo) {
      case 'professor_duplo':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'sem_professor':
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      case 'horario_indisponivel':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const getConflictColor = (tipo: Conflito['tipo']) => {
    switch (tipo) {
      case 'professor_duplo':
        return 'bg-red-50 border-red-200'
      case 'sem_professor':
        return 'bg-orange-50 border-orange-200'
      case 'horario_indisponivel':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const groupedConflicts = conflicts.reduce((acc, conflict) => {
    if (!acc[conflict.tipo]) {
      acc[conflict.tipo] = []
    }
    acc[conflict.tipo].push(conflict)
    return acc
  }, {} as { [key: string]: Conflito[] })

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <h3 className="text-lg font-semibold text-red-700">
          Conflitos Encontrados ({conflicts.length})
        </h3>
      </div>
      
      <div className="space-y-4">
        {Object.entries(groupedConflicts).map(([tipo, conflictsOfType]) => (
          <div key={tipo}>
            <h4 className="font-medium text-gray-800 mb-2 capitalize">
              {tipo.replace('_', ' ')} ({conflictsOfType.length})
            </h4>
            
            <div className="space-y-2">
              {conflictsOfType.map((conflict, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${getConflictColor(conflict.tipo)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getConflictIcon(conflict.tipo)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        {conflict.descricao}
                      </p>
                      {(conflict.dia || conflict.hora) && (
                        <p className="text-xs text-gray-600 mt-1">
                          {conflict.dia && `Dia: ${conflict.dia}`}
                          {conflict.hora && ` • Horário: ${conflict.hora}h`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">💡 Como resolver:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Professor duplo:</strong> Verifique disponibilidade dos professores</li>
          <li>• <strong>Sem professor:</strong> Cadastre professores para as matérias em falta</li>
          <li>• <strong>Horário indisponível:</strong> Ajuste disponibilidade dos professores ou reduza carga horária</li>
        </ul>
      </div>
    </div>
  )
}

export default ConflictList
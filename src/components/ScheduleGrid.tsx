import React from 'react'
import { Schedule, Turma, DIAS_SEMANA, HORARIOS } from '../types'

interface ScheduleGridProps {
  schedule: Schedule
  teachers: any[]
  subjects: any[]
  classes: Turma[]
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ 
  schedule, 
  classes 
}) => {
  const turma = classes.find(c => c.id === schedule.turmaId)
  
  if (!turma) return null

  const getDayLabel = (dia: string) => {
    const labels: { [key: string]: string } = {
      'segunda': 'SEG',
      'terca': 'TER', 
      'quarta': 'QUA',
      'quinta': 'QUI',
      'sexta': 'SEX'
    }
    return labels[dia] || dia
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">
        Grade de Horários - {turma.nome}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-sm font-medium">
                Horário
              </th>
              {DIAS_SEMANA.map(dia => (
                <th key={dia} className="border border-gray-300 bg-gray-100 px-3 py-2 text-sm font-medium">
                  {getDayLabel(dia)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HORARIOS.map(hora => (
              <tr key={hora}>
                <td className="border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-center">
                  {hora}h
                </td>
                {DIAS_SEMANA.map(dia => {
                  const aula = schedule.grade[dia]?.[hora]
                  return (
                    <td key={`${dia}-${hora}`} className="border border-gray-300 px-2 py-3 text-xs">
                      {aula ? (
                        <div className="bg-blue-50 border border-blue-200 rounded p-2">
                          <div className="font-medium text-blue-800">
                            {aula.materia}
                          </div>
                          <div className="text-blue-600 mt-1">
                            {aula.professor}
                          </div>
                        </div>
                      ) : (
                        <div className="h-12 bg-gray-50 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                          -
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>💡 <strong>Legenda:</strong></p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Cada célula mostra a matéria e o professor da aula</li>
          <li>Células vazias (-) indicam horários livres</li>
          <li>Horários: {HORARIOS[0]}h às {HORARIOS[HORARIOS.length - 1]}h</li>
        </ul>
      </div>
    </div>
  )
}

export default ScheduleGrid
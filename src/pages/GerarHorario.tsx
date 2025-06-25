import React, { useState } from 'react'
import { Calendar, RefreshCw, Download, AlertTriangle } from 'lucide-react'
import { useTeachers, useSubjects, useClasses, useSchedules } from '../hooks/useLocalStorage'
import { generateSchedule, validateScheduleIntegrity } from '../utils/scheduleGenerator'
import ScheduleGrid from '../components/ScheduleGrid'
import ConflictList from '../components/ConflictList'
import ExportButton from '../components/ExportButton'
import { Conflito, Schedule } from '../types'

const GerarHorario: React.FC = () => {
  const { teachers } = useTeachers()
  const { subjects } = useSubjects()
  const { classes } = useClasses()
  const { schedules, saveNewSchedules } = useSchedules()
  
  const [generatedSchedules, setGeneratedSchedules] = useState<Schedule[]>([])
  const [conflicts, setConflicts] = useState<Conflito[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  const canGenerate = teachers.length > 0 && subjects.length > 0 && classes.length > 0

  const handleGenerate = () => {
    setIsGenerating(true)
    
    try {
      // Simular um pequeno delay para UX
      setTimeout(() => {
        const result = generateSchedule(teachers, subjects, classes)
        const integrityConflicts = validateScheduleIntegrity(result.schedules)
        
        setGeneratedSchedules(result.schedules)
        setConflicts([...result.conflicts, ...integrityConflicts])
        setHasGenerated(true)
        
        // Salvar no localStorage
        saveNewSchedules(result.schedules)
        
        setIsGenerating(false)
      }, 1000)
    } catch (error) {
      console.error('Erro ao gerar horários:', error)
      setIsGenerating(false)
    }
  }

  const handleExportSchedules = () => {
    const data = {
      schedules: generatedSchedules,
      conflicts,
      teachers,
      subjects,
      classes,
      generatedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `horarios-gerados-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Gerador de Horários
          </h1>
        </div>
        
        <div className="flex space-x-3">
          {hasGenerated && (
            <button
              onClick={handleExportSchedules}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exportar Horários</span>
            </button>
          )}
          
          <ExportButton />
        </div>
      </div>

      {/* Status e Validação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`card ${teachers.length > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${teachers.length > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-medium">Professores</span>
          </div>
          <p className="text-sm mt-1">{teachers.length} cadastrados</p>
        </div>
        
        <div className={`card ${subjects.length > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${subjects.length > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-medium">Matérias</span>
          </div>
          <p className="text-sm mt-1">{subjects.length} cadastradas</p>
        </div>
        
        <div className={`card ${classes.length > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${classes.length > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-medium">Turmas</span>
          </div>
          <p className="text-sm mt-1">{classes.length} cadastradas</p>
        </div>
      </div>

      {/* Botão de Geração */}
      <div className="card text-center">
        {!canGenerate ? (
          <div className="space-y-4">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Dados Insuficientes
              </h2>
              <p className="text-gray-600">
                Para gerar horários, você precisa cadastrar pelo menos:
              </p>
              <ul className="text-gray-600 mt-2 space-y-1">
                {teachers.length === 0 && <li>• 1 professor</li>}
                {subjects.length === 0 && <li>• 1 matéria</li>}
                {classes.length === 0 && <li>• 1 turma</li>}
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Sistema Pronto para Gerar Horários
            </h2>
            <p className="text-gray-600">
              Clique no botão abaixo para gerar automaticamente os horários das turmas
            </p>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`btn-primary flex items-center space-x-2 mx-auto ${
                isGenerating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <Calendar className="h-5 w-5" />
              )}
              <span>
                {isGenerating ? 'Gerando Horários...' : 'Gerar Grade de Horário'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Resultados */}
      {hasGenerated && (
        <div className="space-y-6">
          {/* Conflitos */}
          <ConflictList conflicts={conflicts} />
          
          {/* Grades Geradas */}
          {generatedSchedules.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Horários Gerados ({generatedSchedules.length} turmas)
              </h2>
              
              {generatedSchedules.map(schedule => (
                <ScheduleGrid
                  key={schedule.turmaId}
                  schedule={schedule}
                  teachers={teachers}
                  subjects={subjects}
                  classes={classes}
                />
              ))}
            </div>
          )}
          
          {/* Resumo Final */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Resumo da Geração</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-blue-700">
              <div>
                <span className="font-medium">Turmas processadas:</span>
                <div className="text-lg font-bold">{generatedSchedules.length}</div>
              </div>
              <div>
                <span className="font-medium">Conflitos encontrados:</span>
                <div className="text-lg font-bold">{conflicts.length}</div>
              </div>
              <div>
                <span className="font-medium">Aulas alocadas:</span>
                <div className="text-lg font-bold">
                  {generatedSchedules.reduce((total, schedule) => {
                    return total + Object.values(schedule.grade).reduce((dayTotal, day) => {
                      return dayTotal + Object.keys(day).length
                    }, 0)
                  }, 0)}
                </div>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <div className={`text-lg font-bold ${conflicts.length === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {conflicts.length === 0 ? '✅ Sucesso' : '⚠️ Com conflitos'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Horários Anteriores */}
      {schedules.length > 0 && !hasGenerated && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">
            Horários Salvos Anteriormente
          </h2>
          <p className="text-gray-600 mb-4">
            Existem {schedules.length} grades de horário salvas. Gere novos horários para substituir.
          </p>
          <div className="space-y-4">
            {schedules.map(schedule => (
              <ScheduleGrid
                key={schedule.turmaId}
                schedule={schedule}
                teachers={teachers}
                subjects={subjects}
                classes={classes}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GerarHorario
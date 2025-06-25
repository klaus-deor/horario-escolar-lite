import React, { useState } from 'react'
import { Turma, Materia } from '../types'
import { School, Plus, Clock } from 'lucide-react'

interface FormTurmaProps {
  subjects: Materia[]
  onSubmit: (turma: Turma) => void
  initialData?: Turma
  onCancel?: () => void
}

const FormTurma: React.FC<FormTurmaProps> = ({ 
  subjects, 
  onSubmit, 
  initialData,
  onCancel 
}) => {
  const [nome, setNome] = useState(initialData?.nome || '')
  const [materias, setMaterias] = useState<{ [key: string]: number }>(
    initialData?.materias.reduce((acc, m) => ({
      ...acc,
      [m.materiaId]: m.aulasPorSemana
    }), {}) || {}
  )
  
  // Estados para dobradinhas
  const [permitirDobradinhas, setPermitirDobradinhas] = useState(
    initialData?.dobradinhas?.permitirDobradinhas || false
  )
  const [materiasDobradinhas, setMateriasDobradinhas] = useState<string[]>(
    initialData?.dobradinhas?.materiasPermitidas || []
  )
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!nome.trim()) {
      newErrors.nome = 'Nome da turma é obrigatório'
    }
    
    const materiasComAulas = Object.values(materias).some(aulas => aulas > 0)
    if (!materiasComAulas) {
      newErrors.materias = 'Configure pelo menos uma matéria com aulas'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const turma: Turma = {
      id: initialData?.id || Date.now().toString(),
      nome: nome.trim(),
      materias: Object.entries(materias)
        .filter(([_, aulas]) => aulas > 0)
        .map(([materiaId, aulasPorSemana]) => ({
          materiaId,
          aulasPorSemana
        })),
      dobradinhas: {
        permitirDobradinhas,
        materiasPermitidas: permitirDobradinhas ? materiasDobradinhas : []
      }
    }
    
    onSubmit(turma)
    
    if (!initialData) {
      setNome('')
      setMaterias({})
      setPermitirDobradinhas(false)
      setMateriasDobradinhas([])
    }
  }

  const handleMateriaChange = (materiaId: string, aulas: number) => {
    setMaterias(prev => ({
      ...prev,
      [materiaId]: Math.max(0, Math.min(10, aulas))
    }))
  }

  const handleDobradinhaMateriaChange = (materiaId: string) => {
    setMateriasDobradinhas(prev => 
      prev.includes(materiaId)
        ? prev.filter(id => id !== materiaId)
        : [...prev, materiaId]
    )
  }

  // Filtrar apenas matérias que têm aulas configuradas
  const materiasComAulasConfiguradas = subjects.filter(subject => 
    materias[subject.id] && materias[subject.id] > 0
  )

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <School className="h-5 w-5 text-primary-600" />
        <h2 className="text-lg font-semibold">
          {initialData ? 'Editar Turma' : 'Cadastrar Turma'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Nome da Turma</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={`input-field ${errors.nome ? 'border-red-500' : ''}`}
            placeholder="Ex: 8º C"
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
        </div>

        <div>
          <label className="label">Configuração de Matérias</label>
          {subjects.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Cadastre matérias primeiro para configurar a turma
            </p>
          ) : (
            <div className="space-y-3">
              {subjects.map(materia => (
                <div key={materia.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{materia.nome}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      (Carga: {materia.cargaSemanal} aulas/semana)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Aulas:</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={materias[materia.id] || 0}
                      onChange={(e) => handleMateriaChange(materia.id, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {errors.materias && <p className="text-red-500 text-sm mt-1">{errors.materias}</p>}
        </div>

        {/* Configuração de Dobradinhas */}
        <div className="border-t pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-blue-700" />
            <label className="label mb-0">Configuração de Dobradinhas</label>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="permitirDobradinhas"
                checked={permitirDobradinhas}
                onChange={(e) => setPermitirDobradinhas(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="permitirDobradinhas" className="text-sm font-medium text-gray-700">
                Permitir aulas em sequência (dobradinha)
              </label>
            </div>
            
            <div className="text-xs text-gray-600 ml-6 mb-3">
              💡 <strong>Dobradinha:</strong> Máximo de 2 aulas seguidas da mesma matéria no mesmo dia
            </div>

            {permitirDobradinhas && materiasComAulasConfiguradas.length > 0 && (
              <div className="ml-6 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Quais matérias podem ter dobradinha?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {materiasComAulasConfiguradas.map(materia => (
                    <label key={materia.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={materiasDobradinhas.includes(materia.id)}
                        onChange={() => handleDobradinhaMateriaChange(materia.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{materia.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {permitirDobradinhas && materiasComAulasConfiguradas.length === 0 && (
              <div className="ml-6 text-sm text-yellow-600">
                ⚠️ Configure primeiro as aulas das matérias para selecionar dobradinhas
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <button type="submit" className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>{initialData ? 'Salvar Alterações' : 'Cadastrar Turma'}</span>
          </button>
          
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default FormTurma
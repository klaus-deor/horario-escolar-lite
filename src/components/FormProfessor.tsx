import React, { useState } from 'react'
import { Professor, DIAS_SEMANA, HORARIOS } from '../types'
import { User, Plus } from 'lucide-react'

interface FormProfessorProps {
  subjects: Array<{ id: string; nome: string }>
  onSubmit: (professor: Professor) => void
  initialData?: Professor
  onCancel?: () => void
}

const FormProfessor: React.FC<FormProfessorProps> = ({ 
  subjects, 
  onSubmit, 
  initialData,
  onCancel 
}) => {
  const [nome, setNome] = useState(initialData?.nome || '')
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>(
    initialData?.materias || []
  )
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>(
    initialData?.diasDisponiveis || []
  )
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<number[]>(
    initialData?.horariosDisponiveis || []
  )
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }
    
    if (materiasSelecionadas.length === 0) {
      newErrors.materias = 'Selecione pelo menos uma matéria'
    }
    
    if (diasDisponiveis.length === 0) {
      newErrors.dias = 'Selecione pelo menos um dia'
    }
    
    if (horariosDisponiveis.length === 0) {
      newErrors.horarios = 'Selecione pelo menos um horário'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const professor: Professor = {
      id: initialData?.id || Date.now().toString(),
      nome: nome.trim(),
      materias: materiasSelecionadas,
      diasDisponiveis,
      horariosDisponiveis
    }
    
    onSubmit(professor)
    
    if (!initialData) {
      // Limpar form apenas se for novo cadastro
      setNome('')
      setMateriasSelecionadas([])
      setDiasDisponiveis([])
      setHorariosDisponiveis([])
    }
  }

  const handleMateriaChange = (materiaId: string) => {
    setMateriasSelecionadas(prev => 
      prev.includes(materiaId)
        ? prev.filter(id => id !== materiaId)
        : [...prev, materiaId]
    )
  }

  const handleDiaChange = (dia: string) => {
    setDiasDisponiveis(prev =>
      prev.includes(dia)
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    )
  }

  const handleHorarioChange = (hora: number) => {
    setHorariosDisponiveis(prev =>
      prev.includes(hora)
        ? prev.filter(h => h !== hora)
        : [...prev, hora]
    )
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <User className="h-5 w-5 text-primary-600" />
        <h2 className="text-lg font-semibold">
          {initialData ? 'Editar Professor' : 'Cadastrar Professor'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Nome do Professor</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={`input-field ${errors.nome ? 'border-red-500' : ''}`}
            placeholder="Ex: João Silva"
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
        </div>

        <div>
          <label className="label">Matérias que Leciona</label>
          {subjects.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Cadastre matérias primeiro para selecionar
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {subjects.map(materia => (
                <label key={materia.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={materiasSelecionadas.includes(materia.id)}
                    onChange={() => handleMateriaChange(materia.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{materia.nome}</span>
                </label>
              ))}
            </div>
          )}
          {errors.materias && <p className="text-red-500 text-sm mt-1">{errors.materias}</p>}
        </div>

        <div>
          <label className="label">Dias Disponíveis</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {DIAS_SEMANA.map(dia => (
              <label key={dia} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={diasDisponiveis.includes(dia)}
                  onChange={() => handleDiaChange(dia)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm capitalize">{dia}</span>
              </label>
            ))}
          </div>
          {errors.dias && <p className="text-red-500 text-sm mt-1">{errors.dias}</p>}
        </div>

        <div>
          <label className="label">Horários Disponíveis</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {HORARIOS.map(hora => (
              <label key={hora} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={horariosDisponiveis.includes(hora)}
                  onChange={() => handleHorarioChange(hora)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">{hora}h</span>
              </label>
            ))}
          </div>
          {errors.horarios && <p className="text-red-500 text-sm mt-1">{errors.horarios}</p>}
        </div>

        <div className="flex space-x-3">
          <button type="submit" className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>{initialData ? 'Salvar Alterações' : 'Cadastrar Professor'}</span>
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

export default FormProfessor
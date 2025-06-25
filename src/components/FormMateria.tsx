import React, { useState } from 'react'
import { Materia } from '../types'
import { BookOpen, Plus } from 'lucide-react'

interface FormMateriaProps {
  onSubmit: (materia: Materia) => void
  initialData?: Materia
  onCancel?: () => void
}

const FormMateria: React.FC<FormMateriaProps> = ({ 
  onSubmit, 
  initialData,
  onCancel 
}) => {
  const [nome, setNome] = useState(initialData?.nome || '')
  const [cargaSemanal, setCargaSemanal] = useState(initialData?.cargaSemanal || 1)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!nome.trim()) {
      newErrors.nome = 'Nome da matéria é obrigatório'
    }
    
    if (cargaSemanal < 1 || cargaSemanal > 10) {
      newErrors.carga = 'Carga horária deve ser entre 1 e 10 aulas'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const materia: Materia = {
      id: initialData?.id || Date.now().toString(),
      nome: nome.trim(),
      cargaSemanal
    }
    
    onSubmit(materia)
    
    if (!initialData) {
      setNome('')
      setCargaSemanal(1)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <BookOpen className="h-5 w-5 text-primary-600" />
        <h2 className="text-lg font-semibold">
          {initialData ? 'Editar Matéria' : 'Cadastrar Matéria'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Nome da Matéria</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={`input-field ${errors.nome ? 'border-red-500' : ''}`}
            placeholder="Ex: Matemática"
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
        </div>

        <div>
          <label className="label">Carga Horária Semanal (aulas)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={cargaSemanal}
            onChange={(e) => setCargaSemanal(parseInt(e.target.value) || 1)}
            className={`input-field ${errors.carga ? 'border-red-500' : ''}`}
          />
          {errors.carga && <p className="text-red-500 text-sm mt-1">{errors.carga}</p>}
        </div>

        <div className="flex space-x-3">
          <button type="submit" className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>{initialData ? 'Salvar Alterações' : 'Cadastrar Matéria'}</span>
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

export default FormMateria
import React, { useState } from 'react'
import { BookOpen, Edit, Trash2, Plus } from 'lucide-react'
import { Materia } from '../types'
import { useSubjects } from '../hooks/useLocalStorage'
import FormMateria from '../components/FormMateria'

const CadastroMaterias: React.FC = () => {
  const { subjects, addSubject, removeSubject, updateSubject, loading } = useSubjects()
  const [editingSubject, setEditingSubject] = useState<Materia | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (materia: Materia) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, materia)
      setEditingSubject(null)
    } else {
      addSubject(materia)
    }
    setShowForm(false)
  }

  const handleEdit = (subject: Materia) => {
    setEditingSubject(subject)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta matéria?')) {
      removeSubject(id)
    }
  }

  const handleCancel = () => {
    setEditingSubject(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Cadastro de Matérias
          </h1>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Matéria</span>
        </button>
      </div>

      {showForm && (
        <FormMateria
          onSubmit={handleSubmit}
          initialData={editingSubject || undefined}
          onCancel={handleCancel}
        />
      )}

      {/* Lista de Matérias */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">
          Matérias Cadastradas ({subjects.length})
        </h2>
        
        {subjects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma matéria cadastrada ainda.</p>
            <p className="text-sm">Clique em "Nova Matéria" para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(subject => (
              <div key={subject.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{subject.nome}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {subject.cargaSemanal} aulas por semana
                    </p>
                  </div>
                  
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleEdit(subject)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"
                      title="Editar matéria"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(subject.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                      title="Excluir matéria"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumo */}
      {subjects.length > 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 Resumo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div>
              <span className="font-medium">Total de matérias:</span>
              <span className="ml-2">{subjects.length}</span>
            </div>
            <div>
              <span className="font-medium">Carga total semanal:</span>
              <span className="ml-2">
                {subjects.reduce((total, subject) => total + subject.cargaSemanal, 0)} aulas
              </span>
            </div>
            <div>
              <span className="font-medium">Média por matéria:</span>
              <span className="ml-2">
                {(subjects.reduce((total, subject) => total + subject.cargaSemanal, 0) / subjects.length).toFixed(1)} aulas
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CadastroMaterias
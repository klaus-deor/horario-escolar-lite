import React, { useState } from 'react'
import { Users, Edit, Trash2, Plus } from 'lucide-react'
import { Professor } from '../types'
import { useTeachers, useSubjects } from '../hooks/useLocalStorage'
import FormProfessor from '../components/FormProfessor'

const CadastroProfessores: React.FC = () => {
  const { teachers, addTeacher, removeTeacher, updateTeacher, loading } = useTeachers()
  const { subjects } = useSubjects()
  const [editingTeacher, setEditingTeacher] = useState<Professor | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (professor: Professor) => {
    if (editingTeacher) {
      updateTeacher(editingTeacher.id, professor)
      setEditingTeacher(null)
    } else {
      addTeacher(professor)
    }
    setShowForm(false)
  }

  const handleEdit = (teacher: Professor) => {
    setEditingTeacher(teacher)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      removeTeacher(id)
    }
  }

  const handleCancel = () => {
    setEditingTeacher(null)
    setShowForm(false)
  }

  const getMateriaNames = (materiaIds: string[]) => {
    return materiaIds
      .map(id => subjects.find(s => s.id === id)?.nome)
      .filter(Boolean)
      .join(', ')
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
          <Users className="h-6 w-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Cadastro de Professores
          </h1>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Professor</span>
        </button>
      </div>

      {subjects.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700 font-medium">⚠️ Atenção</p>
          <p className="text-yellow-600 text-sm mt-1">
            Cadastre matérias primeiro para poder associar aos professores.
          </p>
        </div>
      )}

      {showForm && (
        <FormProfessor
          subjects={subjects}
          onSubmit={handleSubmit}
          initialData={editingTeacher || undefined}
          onCancel={handleCancel}
        />
      )}

      {/* Lista de Professores */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">
          Professores Cadastrados ({teachers.length})
        </h2>
        
        {teachers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum professor cadastrado ainda.</p>
            <p className="text-sm">Clique em "Novo Professor" para começar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {teachers.map(teacher => (
              <div key={teacher.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{teacher.nome}</h3>
                    
                    <div className="mt-2 space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Matérias:</span>
                        <span className="ml-2">
                          {getMateriaNames(teacher.materias) || 'Nenhuma matéria'}
                        </span>
                      </div>
                      
                      <div>
                        <span className="font-medium">Dias disponíveis:</span>
                        <span className="ml-2 capitalize">
                          {teacher.diasDisponiveis.join(', ')}
                        </span>
                      </div>
                      
                      <div>
                        <span className="font-medium">Horários:</span>
                        <span className="ml-2">
                          {teacher.horariosDisponiveis.map(h => `${h}h`).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(teacher)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                      title="Editar professor"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(teacher.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded"
                      title="Excluir professor"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CadastroProfessores
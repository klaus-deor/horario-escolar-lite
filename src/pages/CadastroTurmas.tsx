import React, { useState } from 'react'
import { School, Edit, Trash2, Plus, Clock } from 'lucide-react'
import { Turma } from '../types'
import { useClasses, useSubjects } from '../hooks/useLocalStorage'
import FormTurma from '../components/FormTurma'

const CadastroTurmas: React.FC = () => {
  const { classes, addClass, removeClass, updateClass, loading } = useClasses()
  const { subjects } = useSubjects()
  const [editingClass, setEditingClass] = useState<Turma | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (turma: Turma) => {
    if (editingClass) {
      updateClass(editingClass.id, turma)
      setEditingClass(null)
    } else {
      addClass(turma)
    }
    setShowForm(false)
  }

  const handleEdit = (turma: Turma) => {
    setEditingClass(turma)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
      removeClass(id)
    }
  }

  const handleCancel = () => {
    setEditingClass(null)
    setShowForm(false)
  }

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.nome || 'Matéria não encontrada'
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
          <School className="h-6 w-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Cadastro de Turmas
          </h1>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Turma</span>
        </button>
      </div>

      {subjects.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700 font-medium">⚠️ Atenção</p>
          <p className="text-yellow-600 text-sm mt-1">
            Cadastre matérias primeiro para poder configurar as turmas.
          </p>
        </div>
      )}

      {showForm && (
        <FormTurma
          subjects={subjects}
          onSubmit={handleSubmit}
          initialData={editingClass || undefined}
          onCancel={handleCancel}
        />
      )}

      {/* Lista de Turmas */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">
          Turmas Cadastradas ({classes.length})
        </h2>
        
        {classes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <School className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma turma cadastrada ainda.</p>
            <p className="text-sm">Clique em "Nova Turma" para começar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map(turma => (
              <div key={turma.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-lg">{turma.nome}</h3>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Configuração de Matérias:
                      </h4>
                      
                      {turma.materias.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhuma matéria configurada</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {turma.materias.map(materia => (
                            <div key={materia.materiaId} className="bg-gray-100 rounded px-3 py-2 text-sm">
                              <span className="font-medium">
                                {getSubjectName(materia.materiaId)}
                              </span>
                              <span className="text-gray-600 ml-2">
                                ({materia.aulasPorSemana} aulas/sem)
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Configuração de Dobradinhas */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Dobradinhas:</span>
                      </div>
                      
                      {turma.dobradinhas?.permitirDobradinhas ? (
                        <div>
                          <p className="text-xs text-blue-600 mb-1">✅ Permitidas para:</p>
                          {turma.dobradinhas.materiasPermitidas.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {turma.dobradinhas.materiasPermitidas.map(materiaId => (
                                <span 
                                  key={materiaId}
                                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                                >
                                  {getSubjectName(materiaId)}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-blue-600">Nenhuma matéria selecionada</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-blue-600">❌ Não permitidas</p>
                      )}
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">Total de aulas por semana:</span>
                      <span className="ml-2">
                        {turma.materias.reduce((total, m) => total + m.aulasPorSemana, 0)} aulas
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(turma)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                      title="Editar turma"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(turma.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded"
                      title="Excluir turma"
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

      {/* Resumo */}
      {classes.length > 0 && (
        <div className="card bg-purple-50 border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">📊 Resumo</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-purple-700">
            <div>
              <span className="font-medium">Total de turmas:</span>
              <span className="ml-2">{classes.length}</span>
            </div>
            <div>
              <span className="font-medium">Com dobradinhas:</span>
              <span className="ml-2">
                {classes.filter(t => t.dobradinhas?.permitirDobradinhas).length}
              </span>
            </div>
            <div>
              <span className="font-medium">Matérias mais utilizadas:</span>
              <span className="ml-2">
                {(() => {
                  const materiaCount: { [key: string]: number } = {}
                  classes.forEach(turma => {
                    turma.materias.forEach(m => {
                      materiaCount[m.materiaId] = (materiaCount[m.materiaId] || 0) + 1
                    })
                  })
                  const topMateria = Object.entries(materiaCount)
                    .sort(([,a], [,b]) => b - a)[0]
                  return topMateria ? `${getSubjectName(topMateria[0])} (${topMateria[1]} turmas)` : 'N/A'
                })()}
              </span>
            </div>
            <div>
              <span className="font-medium">Média de aulas por turma:</span>
              <span className="ml-2">
                {classes.length > 0 ? (
                  classes.reduce((total, turma) => 
                    total + turma.materias.reduce((t, m) => t + m.aulasPorSemana, 0), 0
                  ) / classes.length
                ).toFixed(1) : 0} aulas
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CadastroTurmas
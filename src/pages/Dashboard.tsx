import React from 'react'
import { Link } from 'react-router-dom'
import { Users, BookOpen, School, Calendar, Download, Activity } from 'lucide-react'
import { useTeachers, useSubjects, useClasses, useSchedules } from '../hooks/useLocalStorage'
import ExportButton from '../components/ExportButton'

const Dashboard: React.FC = () => {
  const { teachers } = useTeachers()
  const { subjects } = useSubjects()
  const { classes } = useClasses()
  const { schedules } = useSchedules()

  const hasMinimalData = teachers.length > 0 && subjects.length > 0 && classes.length > 0

  const stats = [
    {
      label: 'Professores',
      value: teachers.length,
      icon: Users,
      color: 'bg-blue-600',
      link: '/cadastro/professores'
    },
    {
      label: 'Matérias',
      value: subjects.length,
      icon: BookOpen,
      color: 'bg-gray-600',
      link: '/cadastro/materias'
    },
    {
      label: 'Turmas',
      value: classes.length,
      icon: School,
      color: 'bg-gray-700',
      link: '/cadastro/turmas'
    },
    {
      label: 'Grades Geradas',
      value: schedules.length,
      icon: Calendar,
      color: 'bg-blue-500',
      link: '/gerar-horario'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Header minimalista */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-light text-gray-900 tracking-tight">
          Sistema de Horários
        </h1>
        <p className="text-gray-500 text-lg font-light">
          Gestão inteligente de grades escolares
        </p>
      </div>

      {/* Statistics Cards - Design minimalista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link 
              key={stat.label}
              to={stat.link}
              className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-light text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-light text-gray-900 mb-8 flex items-center space-x-3">
          <Activity className="h-6 w-6 text-blue-600" />
          <span>Ações Rápidas</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/cadastro/professores" className="group bg-gray-50 hover:bg-blue-50 rounded-xl p-6 text-center transition-all duration-300 border border-transparent hover:border-blue-100">
            <Users className="h-8 w-8 mb-3 text-gray-600 group-hover:text-blue-600 mx-auto transition-colors duration-300" />
            <span className="text-gray-700 group-hover:text-blue-700 font-medium">Cadastrar Professores</span>
          </Link>
          
          <Link to="/cadastro/materias" className="group bg-gray-50 hover:bg-blue-50 rounded-xl p-6 text-center transition-all duration-300 border border-transparent hover:border-blue-100">
            <BookOpen className="h-8 w-8 mb-3 text-gray-600 group-hover:text-blue-600 mx-auto transition-colors duration-300" />
            <span className="text-gray-700 group-hover:text-blue-700 font-medium">Cadastrar Matérias</span>
          </Link>
          
          <Link to="/cadastro/turmas" className="group bg-gray-50 hover:bg-blue-50 rounded-xl p-6 text-center transition-all duration-300 border border-transparent hover:border-blue-100">
            <School className="h-8 w-8 mb-3 text-gray-600 group-hover:text-blue-600 mx-auto transition-colors duration-300" />
            <span className="text-gray-700 group-hover:text-blue-700 font-medium">Cadastrar Turmas</span>
          </Link>
        </div>
      </div>

      {/* Generate Schedule Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-blue-600" />
          <span>Geração de Horários</span>
        </h2>
        
        {hasMinimalData ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <p className="text-blue-800 font-medium text-lg">Sistema pronto para gerar horários</p>
              <p className="text-blue-600 text-sm mt-2">
                {teachers.length} professores • {subjects.length} matérias • {classes.length} turmas
              </p>
            </div>
            
            <Link to="/gerar-horario" className="inline-flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-colors duration-300">
              <Calendar className="h-5 w-5" />
              <span>Gerar Grade de Horários</span>
            </Link>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-gray-800 font-medium text-lg">Dados insuficientes</p>
            <p className="text-gray-600 text-sm mt-2">
              Para gerar horários, você precisa cadastrar pelo menos:
            </p>
            <ul className="text-gray-600 text-sm mt-3 space-y-1">
              {teachers.length === 0 && <li>• 1 professor</li>}
              {subjects.length === 0 && <li>• 1 matéria</li>}
              {classes.length === 0 && <li>• 1 turma</li>}
            </ul>
          </div>
        )}
      </div>

      {/* Export/Import Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center space-x-3">
          <Download className="h-6 w-6 text-blue-600" />
          <span>Backup e Exportação</span>
        </h2>
        
        <div className="flex space-x-6">
          <ExportButton />
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p><strong>Dica:</strong> Exporte seus dados regularmente como backup de segurança.</p>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
        <h2 className="text-xl font-light text-gray-900 mb-6">Status do Sistema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-medium text-gray-700 mb-1">Armazenamento</p>
            <p className="text-gray-500">localStorage (navegador)</p>
          </div>
          
          <div>
            <p className="font-medium text-gray-700 mb-1">Última atualização</p>
            <p className="text-gray-500">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          
          <div>
            <p className="font-medium text-gray-700 mb-1">Modo</p>
            <p className="text-gray-500">100% offline</p>
          </div>
          
          <div>
            <p className="font-medium text-gray-700 mb-1">Versão</p>
            <p className="text-gray-500">1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
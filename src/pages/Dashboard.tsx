import React from 'react'
import { Link } from 'react-router-dom'
import { Users, BookOpen, School, Calendar, Download, BarChart3 } from 'lucide-react'
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
      color: 'bg-blue-700',
      link: '/cadastro/professores'
    },
    {
      label: 'Matérias',
      value: subjects.length,
      icon: BookOpen,
      color: 'bg-blue-700',
      link: '/cadastro/materias'
    },
    {
      label: 'Turmas',
      value: classes.length,
      icon: School,
      color: 'bg-blue-700',
      link: '/cadastro/turmas'
    },
    {
      label: 'Grades Geradas',
      value: schedules.length,
      icon: Calendar,
      color: 'bg-blue-700',
      link: '/gerar-horario'
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">
          Dashboard - Horário Escolar
        </h1>
        <p className="text-gray-600">
          Sistema de organização de horários escolares
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link 
              key={stat.label}
              to={stat.link}
              className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer border-l-4 border-yellow-400"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-700" />
          <span className="text-blue-700">Ações Rápidas</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/cadastro/professores" className="btn-school text-center flex flex-col items-center">
            <Users className="h-5 w-5 mb-2" />
            <span>Cadastrar Professores</span>
          </Link>
          
          <Link to="/cadastro/materias" className="btn-school text-center flex flex-col items-center">
            <BookOpen className="h-5 w-5 mb-2" />
            <span>Cadastrar Matérias</span>
          </Link>
          
          <Link to="/cadastro/turmas" className="btn-school text-center flex flex-col items-center">
            <School className="h-5 w-5 mb-2" />
            <span>Cadastrar Turmas</span>
          </Link>
        </div>
      </div>

      {/* Generate Schedule Section */}
      <div className="card border-l-4 border-blue-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-700" />
          <span className="text-blue-700">Geração de Horários</span>
        </h2>
        
        {hasMinimalData ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-medium">✅ Sistema pronto para gerar horários!</p>
              <p className="text-green-600 text-sm mt-1">
                Você tem dados suficientes: {teachers.length} professores, {subjects.length} matérias e {classes.length} turmas.
              </p>
            </div>
            
            <Link to="/gerar-horario" className="btn-school inline-flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Gerar Grade de Horário</span>
            </Link>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4">
            <p className="text-yellow-800 font-medium">⚠️ Dados insuficientes</p>
            <p className="text-yellow-700 text-sm mt-1">
              Para gerar horários, você precisa cadastrar pelo menos:
            </p>
            <ul className="text-yellow-700 text-sm mt-2 space-y-1">
              {teachers.length === 0 && <li>• 1 professor</li>}
              {subjects.length === 0 && <li>• 1 matéria</li>}
              {classes.length === 0 && <li>• 1 turma</li>}
            </ul>
          </div>
        )}
      </div>

      {/* Export/Import Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Download className="h-5 w-5 text-blue-700" />
          <span className="text-blue-700">Backup e Exportação</span>
        </h2>
        
        <div className="flex space-x-4">
          <ExportButton />
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>💡 <strong>Dica:</strong> Exporte seus dados regularmente como backup de segurança.</p>
        </div>
      </div>

      {/* System Status */}
      <div className="card" style={{ backgroundColor: '#FFF8DC' }}>
        <h2 className="text-lg font-semibold mb-4 text-blue-700">Status do Sistema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-blue-700">Armazenamento:</p>
            <p className="text-gray-600">localStorage (navegador)</p>
          </div>
          
          <div>
            <p className="font-medium text-blue-700">Última atualização:</p>
            <p className="text-gray-600">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          
          <div>
            <p className="font-medium text-blue-700">Modo:</p>
            <p className="text-gray-600">100% offline</p>
          </div>
          
          <div>
            <p className="font-medium text-blue-700">Versão:</p>
            <p className="text-gray-600">1.0.0 - Colégio Novo Ciclo</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
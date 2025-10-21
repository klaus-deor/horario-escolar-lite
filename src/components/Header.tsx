import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Users, BookOpen, Calendar, Home, School } from 'lucide-react'

// Componente do logo em espiral
const SpiralLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <div className={`${className} relative`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <path
          id="spiral"
          d="M50,10 Q90,10 90,50 Q90,90 50,90 Q10,90 10,50 Q10,20 35,20 Q65,20 65,50 Q65,70 50,70 Q40,70 40,60 Q40,55 45,55"
          fill="none"
        />
      </defs>
      <path
        d="M50,10 Q90,10 90,50 Q90,90 50,90 Q10,90 10,50 Q10,20 35,20 Q65,20 65,50 Q65,70 50,70 Q40,70 40,60 Q40,55 45,55"
        stroke="#1D4ED8"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  </div>
)

const Header: React.FC = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/cadastro/professores', label: 'Professores', icon: Users },
    { path: '/cadastro/materias', label: 'Matérias', icon: BookOpen },
    { path: '/cadastro/turmas', label: 'Turmas', icon: School },
    { path: '/gerar-horario', label: 'Gerar Horário', icon: Calendar }
  ]
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <SpiralLogo className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-light text-gray-900 tracking-tight">
                Colégio Novo Ciclo
              </h1>
              <p className="text-sm text-gray-500 font-light">Sistema de Horários</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === path
                    ? 'text-blue-700 bg-blue-50 border border-blue-100'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Mobile menu */}
          <div className="md:hidden">
            <select 
              className="text-sm border border-gray-200 rounded-xl px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={location.pathname}
              onChange={(e) => window.location.href = e.target.value}
            >
              {navItems.map(({ path, label }) => (
                <option key={path} value={path}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
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
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <SpiralLogo className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-blue-700">
                Colégio Novo Ciclo
              </h1>
              <p className="text-xs text-gray-600">Sistema de Horários</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === path
                    ? 'text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-blue-700'
                }`}
                style={{
                  backgroundColor: location.pathname === path ? '#FFCF49' : undefined,
                  ':hover': { backgroundColor: '#FFF8DC' }
                }}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Mobile menu */}
          <div className="md:hidden">
            <select 
              className="text-sm border rounded-md px-2 py-1 text-blue-700"
              value={location.pathname}
              onChange={(e) => window.location.href = e.target.value}
              style={{ backgroundColor: '#FFF8DC' }}
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
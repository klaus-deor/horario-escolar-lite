import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { School, Users, BookOpen, Calendar, Home } from 'lucide-react'

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
          <div className="flex items-center space-x-2">
            <School className="h-8 w-8 text-primary-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Colégio  | Horário Escolar
            </h1> 
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === path
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Mobile menu - simplified for now */}
          <div className="md:hidden">
            <select 
              className="text-sm border rounded-md px-2 py-1"
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
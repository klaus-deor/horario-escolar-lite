import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import CadastroProfessores from './pages/CadastroProfessores'
import CadastroMaterias from './pages/CadastroMaterias'
import CadastroTurmas from './pages/CadastroTurmas'
import GerarHorario from './pages/GerarHorario'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cadastro/professores" element={<CadastroProfessores />} />
          <Route path="/cadastro/materias" element={<CadastroMaterias />} />
          <Route path="/cadastro/turmas" element={<CadastroTurmas />} />
          <Route path="/gerar-horario" element={<GerarHorario />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
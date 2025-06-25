import { Professor, Materia, Turma, Schedule } from '../types'

const STORAGE_KEYS = {
  TEACHERS: 'horario_escolar_teachers',
  SUBJECTS: 'horario_escolar_subjects', 
  CLASSES: 'horario_escolar_classes',
  SCHEDULES: 'horario_escolar_schedules'
} as const

// Funções de validação para garantir integridade dos dados
const validateTeacher = (data: any): data is Professor => {
  return data && 
    typeof data.id === 'string' &&
    typeof data.nome === 'string' &&
    Array.isArray(data.materias) &&
    Array.isArray(data.diasDisponiveis) &&
    Array.isArray(data.horariosDisponiveis)
}

const validateSubject = (data: any): data is Materia => {
  return data &&
    typeof data.id === 'string' &&
    typeof data.nome === 'string' &&
    typeof data.cargaSemanal === 'number'
}

const validateClass = (data: any): data is Turma => {
  return data &&
    typeof data.id === 'string' &&
    typeof data.nome === 'string' &&
    Array.isArray(data.materias)
}

// Função para migrar dados antigos para o novo formato
const migrateClassData = (data: any): Turma => {
  // Se não tem configuração de dobradinhas, adicionar valores padrão
  if (!data.dobradinhas) {
    return {
      ...data,
      dobradinhas: {
        permitirDobradinhas: false,
        materiasPermitidas: []
      }
    }
  }
  return data
}

// Professores
export const getTeachers = (): Professor[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEACHERS)
    if (!data) return []
    
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed.filter(validateTeacher) : []
  } catch (error) {
    console.error('Erro ao carregar professores:', error)
    return []
  }
}

export const saveTeachers = (teachers: Professor[]): void => {
  try {
    const validTeachers = teachers.filter(validateTeacher)
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(validTeachers))
  } catch (error) {
    console.error('Erro ao salvar professores:', error)
    throw new Error('Erro ao salvar dados dos professores')
  }
}

// Matérias
export const getSubjects = (): Materia[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS)
    if (!data) return []
    
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed.filter(validateSubject) : []
  } catch (error) {
    console.error('Erro ao carregar matérias:', error)
    return []
  }
}

export const saveSubjects = (subjects: Materia[]): void => {
  try {
    const validSubjects = subjects.filter(validateSubject)
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(validSubjects))
  } catch (error) {
    console.error('Erro ao salvar matérias:', error)
    throw new Error('Erro ao salvar dados das matérias')
  }
}

// Turmas
export const getClasses = (): Turma[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CLASSES)
    if (!data) return []
    
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed)) return []
    
    // Migrar dados antigos e validar
    return parsed
      .map(migrateClassData)
      .filter(validateClass)
  } catch (error) {
    console.error('Erro ao carregar turmas:', error)
    return []
  }
}

export const saveClasses = (classes: Turma[]): void => {
  try {
    const validClasses = classes.filter(validateClass)
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(validClasses))
  } catch (error) {
    console.error('Erro ao salvar turmas:', error)
    throw new Error('Erro ao salvar dados das turmas')
  }
}

// Horários
export const getSchedules = (): Schedule[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULES)
    if (!data) return []
    
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Erro ao carregar horários:', error)
    return []
  }
}

export const saveSchedules = (schedules: Schedule[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules))
  } catch (error) {
    console.error('Erro ao salvar horários:', error)
    throw new Error('Erro ao salvar horários gerados')
  }
}

// Exportar todos os dados
export const exportAllData = () => {
  const data = {
    teachers: getTeachers(),
    subjects: getSubjects(),
    classes: getClasses(),
    schedules: getSchedules(),
    exportDate: new Date().toISOString(),
    version: '2.0' // Versão com suporte a dobradinhas
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `horario-escolar-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Limpar todos os dados
export const clearAllData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error('Erro ao limpar dados:', error)
    throw new Error('Erro ao limpar dados do sistema')
  }
}
export interface Professor {
  id: string
  nome: string
  materias: string[]
  diasDisponiveis: string[]
  horariosDisponiveis: number[]
}

export interface Materia {
  id: string
  nome: string
  cargaSemanal: number
}

export interface Turma {
  id: string
  nome: string
  materias: {
    materiaId: string
    aulasPorSemana: number
  }[]
}

export interface AulaSchedule {
  materia: string
  professor: string
  materiaId: string
  professorId: string
}

export interface Schedule {
  turmaId: string
  grade: {
    [dia: string]: {
      [hora: number]: AulaSchedule
    }
  }
}

export interface Conflito {
  tipo: 'professor_duplo' | 'sem_professor' | 'horario_indisponivel'
  descricao: string
  turma?: string
  dia?: string
  hora?: number
}

export const DIAS_SEMANA = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'] as const
export const HORARIOS = [7, 8, 9, 10, 11, 12] as const

export type DiaSemana = typeof DIAS_SEMANA[number]
export type Horario = typeof HORARIOS[number]
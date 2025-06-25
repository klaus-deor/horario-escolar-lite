import { Professor, Materia, Turma, Schedule, Conflito, DIAS_SEMANA, HORARIOS } from '../types'

export const generateSchedule = (
  teachers: Professor[],
  subjects: Materia[],
  classes: Turma[]
): { schedules: Schedule[], conflicts: Conflito[] } => {
  const schedules: Schedule[] = []
  const conflicts: Conflito[] = []
  
  // Mapa para controlar alocação de professores por dia/hora
  const professorAllocation: { [key: string]: string } = {}
  
  for (const turma of classes) {
    const schedule: Schedule = {
      turmaId: turma.id,
      grade: {}
    }
    
    // Inicializar grade vazia
    DIAS_SEMANA.forEach(dia => {
      schedule.grade[dia] = {}
    })
    
    // Para cada matéria da turma
    for (const materiaInfo of turma.materias) {
      const materia = subjects.find(s => s.id === materiaInfo.materiaId)
      if (!materia) continue
      
      // Encontrar professores que lecionam esta matéria
      const professoresDisponiveis = teachers.filter(t => 
        t.materias.includes(materiaInfo.materiaId)
      )
      
      if (professoresDisponiveis.length === 0) {
        conflicts.push({
          tipo: 'sem_professor',
          descricao: `Nenhum professor disponível para ${materia.nome} na turma ${turma.nome}`
        })
        continue
      }
      
      // Alocar aulas para esta matéria
      let aulasAlocadas = 0
      const aulasNecessarias = materiaInfo.aulasPorSemana
      
      for (const dia of DIAS_SEMANA) {
        if (aulasAlocadas >= aulasNecessarias) break
        
        for (const hora of HORARIOS) {
          if (aulasAlocadas >= aulasNecessarias) break
          
          // Verificar se já tem aula neste horário
          if (schedule.grade[dia][hora]) continue
          
          // Tentar alocar um professor
          const professorDisponivel = professoresDisponiveis.find(prof => {
            const key = `${dia}-${hora}`
            const profKey = `${prof.id}-${key}`
            
            return (
              prof.diasDisponiveis.includes(dia) &&
              prof.horariosDisponiveis.includes(hora) &&
              !professorAllocation[profKey]
            )
          })
          
          if (professorDisponivel) {
            // Alocar aula
            schedule.grade[dia][hora] = {
              materia: materia.nome,
              professor: professorDisponivel.nome,
              materiaId: materia.id,
              professorId: professorDisponivel.id
            }
            
            // Marcar professor como ocupado neste horário
            const profKey = `${professorDisponivel.id}-${dia}-${hora}`
            professorAllocation[profKey] = turma.id
            
            aulasAlocadas++
          }
        }
      }
      
      // Verificar se conseguiu alocar todas as aulas necessárias
      if (aulasAlocadas < aulasNecessarias) {
        conflicts.push({
          tipo: 'horario_indisponivel',
          descricao: `Não foi possível alocar todas as ${aulasNecessarias} aulas de ${materia.nome} para ${turma.nome}. Alocadas: ${aulasAlocadas}`
        })
      }
    }
    
    schedules.push(schedule)
  }
  
  return { schedules, conflicts }
}

export const validateScheduleIntegrity = (schedules: Schedule[]): Conflito[] => {
  const conflicts: Conflito[] = []
  const professorHorarios: { [key: string]: string[] } = {}
  
  schedules.forEach(schedule => {
    Object.entries(schedule.grade).forEach(([dia, horarios]) => {
      Object.entries(horarios).forEach(([hora, aula]) => {
        const key = `${aula.professorId}-${dia}-${hora}`
        
        if (!professorHorarios[key]) {
          professorHorarios[key] = []
        }
        
        professorHorarios[key].push(schedule.turmaId)
        
        if (professorHorarios[key].length > 1) {
          conflicts.push({
            tipo: 'professor_duplo',
            descricao: `Professor ${aula.professor} está alocado em múltiplas turmas no ${dia} às ${hora}h`,
            dia,
            hora: parseInt(hora)
          })
        }
      })
    })
  })
  
  return conflicts
}
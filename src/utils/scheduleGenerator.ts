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
      
      // Alocar aulas para esta matéria com distribuição inteligente
      let aulasAlocadas = 0
      const aulasNecessarias = materiaInfo.aulasPorSemana
      
      // Verificar se matéria pode ter dobradinha
      const podeTermDobradinha = turma.dobradinhas?.permitirDobradinhas && 
                                turma.dobradinhas?.materiasPermitidas.includes(materiaInfo.materiaId)
      
      // Array para armazenar todas as possibilidades de alocação
      const possibilidades: Array<{dia: string, hora: number, professor: Professor}> = []
      
      // Coletar todas as possibilidades
      for (const dia of DIAS_SEMANA) {
        for (const hora of HORARIOS) {
          // Verificar se já tem aula neste horário
          if (schedule.grade[dia][hora]) continue
          
          // Tentar encontrar um professor disponível
          const professorDisponivel = professoresDisponiveis.find(prof => {
            const profKey = `${prof.id}-${dia}-${hora}`
            
            return (
              prof.diasDisponiveis.includes(dia) &&
              prof.horariosDisponiveis.includes(hora) &&
              !professorAllocation[profKey]
            )
          })
          
          if (professorDisponivel) {
            possibilidades.push({ dia, hora, professor: professorDisponivel })
          }
        }
      }
      
      // Algoritmo de distribuição inteligente
      const aulasAlocadasPorDia: { [dia: string]: number } = {}
      DIAS_SEMANA.forEach(dia => { aulasAlocadasPorDia[dia] = 0 })
      
      // Função para verificar se pode alocar uma aula
      const podeAlocarAula = (dia: string, hora: number): boolean => {
        // Verificar se já tem aula neste horário
        if (schedule.grade[dia][hora]) return false
        
        // Se não permite dobradinha, não pode ter mais de 1 aula da mesma matéria no dia
        if (!podeTermDobradinha && aulasAlocadasPorDia[dia] >= 1) {
          return false
        }
        
        // Se permite dobradinha, máximo 2 aulas da mesma matéria no dia
        if (podeTermDobradinha && aulasAlocadasPorDia[dia] >= 2) {
          return false
        }
        
        // Se já tem 1 aula no dia e permite dobradinha, verificar se pode ser sequencial
        if (podeTermDobradinha && aulasAlocadasPorDia[dia] === 1) {
          // Verificar se tem uma aula da mesma matéria adjacente
          const horaAnterior = hora - 1
          const horaPosterior = hora + 1
          
          const temAulaAnterior = schedule.grade[dia][horaAnterior]?.materiaId === materiaInfo.materiaId
          const temAulaPosterior = schedule.grade[dia][horaPosterior]?.materiaId === materiaInfo.materiaId
          
          // Só permite se for adjacente a uma aula já alocada (dobradinha)
          return temAulaAnterior || temAulaPosterior
        }
        
        return true
      }
      
      // Priorizar distribuição uniforme ao longo da semana
      for (const { dia, hora, professor } of possibilidades) {
        if (aulasAlocadas >= aulasNecessarias) break
        
        if (podeAlocarAula(dia, hora)) {
          // Alocar aula
          schedule.grade[dia][hora] = {
            materia: materia.nome,
            professor: professor.nome,
            materiaId: materia.id,
            professorId: professor.id
          }
          
          // Marcar professor como ocupado neste horário
          const profKey = `${professor.id}-${dia}-${hora}`
          professorAllocation[profKey] = turma.id
          
          aulasAlocadas++
          aulasAlocadasPorDia[dia]++
        }
      }
      
      // Verificar se conseguiu alocar todas as aulas necessárias
      if (aulasAlocadas < aulasNecessarias) {
        conflicts.push({
          tipo: 'horario_indisponivel',
          descricao: `Não foi possível alocar todas as ${aulasNecessarias} aulas de ${materia.nome} para ${turma.nome}. Alocadas: ${aulasAlocadas}`
        })
      }
      
      // Verificar se há violação de regras de dobradinha
      for (const dia of DIAS_SEMANA) {
        let aulasSequenciais = 0
        let maxSequencia = 0
        
        for (const hora of HORARIOS) {
          if (schedule.grade[dia][hora]?.materiaId === materiaInfo.materiaId) {
            aulasSequenciais++
            maxSequencia = Math.max(maxSequencia, aulasSequenciais)
          } else {
            aulasSequenciais = 0
          }
        }
        
        // Verificar violações
        if (!podeTermDobradinha && maxSequencia > 1) {
          conflicts.push({
            tipo: 'dobradinha_invalida',
            descricao: `${materia.nome} tem ${maxSequencia} aulas seguidas na ${dia} para ${turma.nome}, mas dobradinhas não estão permitidas`,
            turma: turma.nome,
            dia
          })
        } else if (podeTermDobradinha && maxSequencia > 2) {
          conflicts.push({
            tipo: 'dobradinha_invalida',
            descricao: `${materia.nome} tem ${maxSequencia} aulas seguidas na ${dia} para ${turma.nome}, máximo permitido é 2`,
            turma: turma.nome,
            dia
          })
        }
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
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
      
      // Verificar se matéria pode ter dobradinha
      const podeTermDobradinha = turma.dobradinhas?.permitirDobradinhas && 
                                turma.dobradinhas?.materiasPermitidas.includes(materiaInfo.materiaId)
      
      // Embaralhar dias para distribuição aleatória
      const diasEmbaralhados = [...DIAS_SEMANA].sort(() => Math.random() - 0.5)
      
      for (const dia of diasEmbaralhados) {
        if (aulasAlocadas >= aulasNecessarias) break
        
        // Embaralhar horários para distribuição aleatória
        const horariosEmbaralhados = [...HORARIOS].sort(() => Math.random() - 0.5)
        
        for (const hora of horariosEmbaralhados) {
          if (aulasAlocadas >= aulasNecessarias) break
          
          // Verificar se já tem aula neste horário
          if (schedule.grade[dia][hora]) continue
          
          // Contar quantas aulas desta matéria já tem neste dia
          const aulasNoDia = HORARIOS.filter(h => 
            schedule.grade[dia][h]?.materiaId === materiaInfo.materiaId
          ).length
          
          // Verificar se pode alocar dobradinha (2 aulas seguidas)
          if (podeTermDobradinha && aulasNecessarias - aulasAlocadas >= 2 && aulasNoDia === 0) {
            // Tentar alocar dobradinha se há horário seguinte disponível
            const proximaHora = HORARIOS[HORARIOS.indexOf(hora) + 1]
            
            if (proximaHora && !schedule.grade[dia][proximaHora]) {
              // Encontrar professor disponível para ambos os horários
              const professorDisponivel = professoresDisponiveis.find(prof => {
                const profKey1 = `${prof.id}-${dia}-${hora}`
                const profKey2 = `${prof.id}-${dia}-${proximaHora}`
                
                return (
                  prof.diasDisponiveis.includes(dia) &&
                  prof.horariosDisponiveis.includes(hora) &&
                  prof.horariosDisponiveis.includes(proximaHora) &&
                  !professorAllocation[profKey1] &&
                  !professorAllocation[profKey2]
                )
              })
              
              if (professorDisponivel) {
                // Alocar dobradinha
                schedule.grade[dia][hora] = {
                  materia: materia.nome,
                  professor: professorDisponivel.nome,
                  materiaId: materia.id,
                  professorId: professorDisponivel.id
                }
                
                schedule.grade[dia][proximaHora] = {
                  materia: materia.nome,
                  professor: professorDisponivel.nome,
                  materiaId: materia.id,
                  professorId: professorDisponivel.id
                }
                
                // Marcar professor como ocupado em ambos os horários
                const profKey1 = `${professorDisponivel.id}-${dia}-${hora}`
                const profKey2 = `${professorDisponivel.id}-${dia}-${proximaHora}`
                professorAllocation[profKey1] = turma.id
                professorAllocation[profKey2] = turma.id
                
                aulasAlocadas += 2
                continue
              }
            }
          }
          
          // Se não pode ou não conseguiu dobradinha, tentar aula simples
          // Mas não pode ter mais de 2 aulas da mesma matéria no mesmo dia
          if (aulasNoDia >= 2) continue
          
          // Se já tem 1 aula no dia e não permite dobradinha, pular
          if (!podeTermDobradinha && aulasNoDia >= 1) continue
          
          // Encontrar professor disponível para esta aula
          const professorDisponivel = professoresDisponiveis.find(prof => {
            const profKey = `${prof.id}-${dia}-${hora}`
            
            return (
              prof.diasDisponiveis.includes(dia) &&
              prof.horariosDisponiveis.includes(hora) &&
              !professorAllocation[profKey]
            )
          })
          
          if (professorDisponivel) {
            // Alocar aula simples
            schedule.grade[dia][hora] = {
              materia: materia.nome,
              professor: professorDisponivel.nome,
              materiaId: materia.id,
              professorId: professorDisponivel.id
            }
            
            // Marcar professor como ocupado
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
      
      // Validar que não há mais de 2 aulas seguidas da mesma matéria
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
        
        // Verificar violações - máximo 2 aulas seguidas
        if (maxSequencia > 2) {
          conflicts.push({
            tipo: 'dobradinha_invalida',
            descricao: `ERRO: ${materia.nome} tem ${maxSequencia} aulas seguidas na ${dia} para ${turma.nome}. Máximo permitido é 2 (dobradinha)`,
            turma: turma.nome,
            dia
          })
        }
        
        // Se não permite dobradinha, não pode ter mais de 1 aula seguida
        if (!podeTermDobradinha && maxSequencia > 1) {
          conflicts.push({
            tipo: 'dobradinha_invalida',
            descricao: `${materia.nome} tem ${maxSequencia} aulas seguidas na ${dia} para ${turma.nome}, mas dobradinhas não estão permitidas`,
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
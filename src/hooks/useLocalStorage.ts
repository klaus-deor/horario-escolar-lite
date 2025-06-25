import { useState, useEffect } from 'react'
import { Professor, Materia, Turma, Schedule } from '../types'
import { 
  getTeachers, saveTeachers,
  getSubjects, saveSubjects,
  getClasses, saveClasses,
  getSchedules, saveSchedules
} from '../utils/localStorage'

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    try {
      const data = getTeachers()
      setTeachers(data)
    } catch (error) {
      console.error('Erro ao carregar professores:', error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  const addTeacher = (teacher: Professor) => {
    const newTeachers = [...teachers, teacher]
    setTeachers(newTeachers)
    saveTeachers(newTeachers)
  }
  
  const removeTeacher = (id: string) => {
    const newTeachers = teachers.filter(t => t.id !== id)
    setTeachers(newTeachers)
    saveTeachers(newTeachers)
  }
  
  const updateTeacher = (id: string, updatedTeacher: Professor) => {
    const newTeachers = teachers.map(t => t.id === id ? updatedTeacher : t)
    setTeachers(newTeachers)
    saveTeachers(newTeachers)
  }
  
  return { teachers, addTeacher, removeTeacher, updateTeacher, loading }
}

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Materia[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    try {
      const data = getSubjects()
      setSubjects(data)
    } catch (error) {
      console.error('Erro ao carregar matérias:', error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  const addSubject = (subject: Materia) => {
    const newSubjects = [...subjects, subject]
    setSubjects(newSubjects)
    saveSubjects(newSubjects)
  }
  
  const removeSubject = (id: string) => {
    const newSubjects = subjects.filter(s => s.id !== id)
    setSubjects(newSubjects)
    saveSubjects(newSubjects)
  }
  
  const updateSubject = (id: string, updatedSubject: Materia) => {
    const newSubjects = subjects.map(s => s.id === id ? updatedSubject : s)
    setSubjects(newSubjects)
    saveSubjects(newSubjects)
  }
  
  return { subjects, addSubject, removeSubject, updateSubject, loading }
}

export const useClasses = () => {
  const [classes, setClasses] = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    try {
      const data = getClasses()
      setClasses(data)
    } catch (error) {
      console.error('Erro ao carregar turmas:', error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  const addClass = (turma: Turma) => {
    const newClasses = [...classes, turma]
    setClasses(newClasses)
    saveClasses(newClasses)
  }
  
  const removeClass = (id: string) => {
    const newClasses = classes.filter(c => c.id !== id)
    setClasses(newClasses)  
    saveClasses(newClasses)
  }
  
  const updateClass = (id: string, updatedClass: Turma) => {
    const newClasses = classes.map(c => c.id === id ? updatedClass : c)
    setClasses(newClasses)
    saveClasses(newClasses)
  }
  
  return { classes, addClass, removeClass, updateClass, loading }
}

export const useSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    try {
      const data = getSchedules()
      setSchedules(data)
    } catch (error) {
      console.error('Erro ao carregar horários:', error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  const saveNewSchedules = (newSchedules: Schedule[]) => {
    setSchedules(newSchedules)
    saveSchedules(newSchedules)
  }
  
  const clearSchedules = () => {
    setSchedules([])
    saveSchedules([])
  }
  
  return { schedules, saveNewSchedules, clearSchedules, loading }
}
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface ScheduleData {
  id?: string
  name: string
  nodes: any[]
  settings: {
    startTime: number
    endTime: number
    timeFontSize: number
    timeHeight: number
  }
  created_at?: string
  updated_at?: string
}

export const saveSchedule = async (scheduleData: ScheduleData) => {
  const { data, error } = await supabase
    .from('schedules')
    .upsert({
      name: scheduleData.name,
      nodes: scheduleData.nodes,
      settings: scheduleData.settings
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const loadSchedules = async () => {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

export const deleteSchedule = async (id: string) => {
  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', id)

  if (error) throw error
}
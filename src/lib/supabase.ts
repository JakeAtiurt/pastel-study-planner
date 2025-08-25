import { supabase } from '@/integrations/supabase/client'

export interface ScheduleData {
  id?: string
  name: string
  nodes: any[]
  settings: {
    startTime: number
    endTime: number
    timeFontSize: number
    timeHeight?: number // Keep for backward compatibility
    rowHeights?: Record<number, number>
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
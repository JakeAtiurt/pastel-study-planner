import { supabase } from '@/integrations/supabase/client'

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
    .from('schedules' as any)
    .upsert({
      name: scheduleData.name,
      nodes: scheduleData.nodes,
      settings: scheduleData.settings
    })
    .select()
    .maybeSingle()

  if (error) throw error
  return data
}

export const loadSchedules = async (): Promise<ScheduleData[]> => {
  const { data, error } = await supabase
    .from('schedules' as any)
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data as unknown as ScheduleData[]) || []
}

export const deleteSchedule = async (id: string) => {
  const { error } = await supabase
    .from('schedules' as any)
    .delete()
    .eq('id', id)

  if (error) throw error
}
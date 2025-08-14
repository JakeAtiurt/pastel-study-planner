import React, { useState, useEffect } from 'react'
import { saveSchedule, loadSchedules, deleteSchedule, ScheduleData } from '../lib/supabase'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useToast } from './ui/use-toast'

interface SaveLoadPanelProps {
  onSave: () => { nodes: any[], settings: any }
  onLoad: (data: ScheduleData) => void
}

const SaveLoadPanel: React.FC<SaveLoadPanelProps> = ({ onSave, onLoad }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scheduleName, setScheduleName] = useState('')
  const [savedSchedules, setSavedSchedules] = useState<ScheduleData[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchSchedules = async () => {
    try {
      const schedules = await loadSchedules()
      setSavedSchedules(schedules)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load schedules",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchSchedules()
    }
  }, [isOpen])

  const handleSave = async () => {
    if (!scheduleName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a schedule name",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const { nodes, settings } = onSave()
      await saveSchedule({
        name: scheduleName,
        nodes,
        settings
      })
      
      toast({
        title: "Success",
        description: "Schedule saved successfully!",
      })
      
      setScheduleName('')
      fetchSchedules()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save schedule",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLoad = (schedule: ScheduleData) => {
    onLoad(schedule)
    setIsOpen(false)
    toast({
      title: "Success",
      description: `Loaded "${schedule.name}"`,
    })
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return

    try {
      await deleteSchedule(id!)
      toast({
        title: "Success",
        description: "Schedule deleted",
      })
      fetchSchedules()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete schedule",
        variant: "destructive"
      })
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
      >
        💾 Save/Load
      </Button>
    )
  }

  return (
    <Card className="absolute top-20 right-0 w-80 z-50 bg-white/95 backdrop-blur-sm border-purple-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-purple-700">💾 Save & Load</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Save Section */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-gray-700">Save Current Schedule</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Schedule name..."
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSave} 
              disabled={loading}
              size="sm"
              className="bg-green-500 hover:bg-green-600"
            >
              💾
            </Button>
          </div>
        </div>

        {/* Load Section */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-gray-700">Saved Schedules</h4>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {savedSchedules.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No saved schedules</p>
            ) : (
              savedSchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{schedule.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(schedule.updated_at!).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleLoad(schedule)}
                    className="text-xs"
                  >
                    📂
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDelete(schedule.id!, schedule.name)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    🗑️
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SaveLoadPanel
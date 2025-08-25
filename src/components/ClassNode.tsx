import React, { useState, useCallback, useRef } from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react';

interface ClassNodeData {
  subject: string;
  code: string;
  section: string;
  startTime: number;
  endTime: number;
  color: string;
  icon: string;
  classroom?: string;
}

interface ClassNodeProps {
  data: ClassNodeData;
  selected: boolean;
  id: string;
}

const ClassNode = ({ data, selected, id }: ClassNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);
  const dragStartRef = useRef<{ y: number; time: number } | null>(null);
  const { setNodes } = useReactFlow();

  const getEmojiIcon = (iconType: string) => {
    switch (iconType) {
      case "physics": return "🌸";
      case "math": return "📘";
      case "chemistry": return "🧪";
      case "engineering": return "⚙️";
      case "thinking": return "🧠";
      case "innovation": return "💡";
      default: return "📚";
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      pink: "bg-pink-100/80 border-pink-200 text-pink-900 shadow-pink-200/50",
      blue: "bg-blue-100/80 border-blue-200 text-blue-900 shadow-blue-200/50", 
      mint: "bg-emerald-100/80 border-emerald-200 text-emerald-900 shadow-emerald-200/50",
      lavender: "bg-purple-100/80 border-purple-200 text-purple-900 shadow-purple-200/50",
      yellow: "bg-amber-100/80 border-amber-200 text-amber-900 shadow-amber-200/50",
      peach: "bg-orange-100/80 border-orange-200 text-orange-900 shadow-orange-200/50",
      grey: "bg-gray-100/80 border-gray-200 text-gray-900 shadow-gray-200/50"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.pink;
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = (time % 1) * 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Update the node data - this would normally update through a context or callback
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditData(data);
      setIsEditing(false);
    }
  };

  const handleTimeAdjustment = useCallback((newData: ClassNodeData) => {
    setEditData(newData);
    // Update the node in React Flow
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: newData as unknown as Record<string, unknown> }
          : node
      )
    );
  }, [id, setNodes]);

  const handleDragStart = (type: 'start' | 'end', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(type);
    dragStartRef.current = {
      y: e.clientY,
      time: type === 'start' ? editData.startTime : editData.endTime
    };
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current) return;
      
      const deltaY = moveEvent.clientY - dragStartRef.current.y;
      const timeDelta = deltaY / 60; // 60px = 1 hour
      const newTime = dragStartRef.current.time + timeDelta;
      
      if (type === 'start') {
        const clampedTime = Math.max(0, Math.min(editData.endTime - 0.5, newTime));
        const roundedTime = Math.round(clampedTime * 4) / 4; // Round to 15-minute intervals
        const newData = { ...editData, startTime: roundedTime };
        handleTimeAdjustment(newData);
      } else {
        const clampedTime = Math.max(editData.startTime + 0.5, Math.min(24, newTime));
        const roundedTime = Math.round(clampedTime * 4) / 4; // Round to 15-minute intervals
        const newData = { ...editData, endTime: roundedTime };
        handleTimeAdjustment(newData);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(null);
      dragStartRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      <NodeResizer 
        minWidth={180} 
        minHeight={160} 
        isVisible={selected}
        lineStyle={{ borderColor: '#9E86ED' }}
        handleStyle={{ backgroundColor: '#9E86ED', width: 8, height: 8 }}
      />
      
      <div
        className={`rounded-2xl border-2 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden w-full h-full ${getColorClasses(editData.color)}`}
        onDoubleClick={handleDoubleClick}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl pointer-events-none"></div>
        
        <div className="relative h-full flex flex-col">
          {/* Top Section: Icon, Course Code, and Color */}
          <div className="flex items-center gap-2 mb-2">
            {isEditing ? (
              <>
                <select
                  className="text-xl bg-transparent border border-current rounded outline-none cursor-pointer"
                  value={editData.icon}
                  onChange={(e) => setEditData({...editData, icon: e.target.value})}
                >
                  <option value="physics">🌸</option>
                  <option value="math">📘</option>
                  <option value="chemistry">🧪</option>
                  <option value="engineering">⚙️</option>
                  <option value="thinking">🧠</option>
                  <option value="innovation">💡</option>
                  <option value="default">📚</option>
                </select>
                <select
                  className="text-xs bg-white/90 border border-current rounded outline-none cursor-pointer px-2 py-1"
                  value={editData.color}
                  onChange={(e) => setEditData({...editData, color: e.target.value})}
                  title="Change color"
                >
                  <option value="pink">🌸 Pink</option>
                  <option value="blue">💙 Blue</option>
                  <option value="mint">🌿 Mint</option>
                  <option value="lavender">💜 Lavender</option>
                  <option value="yellow">💛 Yellow</option>
                  <option value="peach">🧡 Peach</option>
                  <option value="grey">🩶 Grey</option>
                </select>
              </>
            ) : (
              <span className="text-xl">{getEmojiIcon(editData.icon)}</span>
            )}
            <div className="flex flex-col flex-1">
              {isEditing ? (
                <input
                  className="text-sm font-bold tracking-wide bg-transparent border-b border-current outline-none"
                  value={editData.code}
                  onChange={(e) => setEditData({...editData, code: e.target.value})}
                  onKeyDown={handleKeyPress}
                  autoFocus
                />
              ) : (
                <span className={`font-bold tracking-wide ${editData.code.length > 8 ? 'text-xs' : editData.code.length > 6 ? 'text-sm' : 'text-base'}`}>{editData.code}</span>
              )}
              
              {isEditing ? (
                <input
                  className="text-xs opacity-75 font-medium bg-transparent border-b border-current outline-none mt-1"
                  value={editData.section}
                  onChange={(e) => setEditData({...editData, section: e.target.value})}
                  onKeyDown={handleKeyPress}
                  placeholder="Section"
                />
              ) : (
                <span className="text-xs opacity-75 font-medium">Sec {editData.section}</span>
              )}
              
              {editData.classroom && (
                isEditing ? (
                  <input
                    className="text-xs opacity-70 font-medium bg-transparent border-b border-current outline-none mt-1"
                    value={editData.classroom}
                    onChange={(e) => setEditData({...editData, classroom: e.target.value})}
                    onKeyDown={handleKeyPress}
                    placeholder="Classroom"
                  />
                ) : (
                  <span className="text-xs opacity-70 font-medium mt-0.5">{editData.classroom}</span>
                )
              )}
            </div>
          </div>
          
          {/* Middle Section: Subject Name */}
          <div className="text-xs font-medium leading-relaxed mb-3 flex-1">
            {isEditing ? (
              <textarea
                className="w-full h-full bg-transparent border border-current rounded outline-none p-1 resize-none"
                value={editData.subject}
                onChange={(e) => setEditData({...editData, subject: e.target.value})}
                onKeyDown={handleKeyPress}
              />
            ) : (
              editData.subject
            )}
          </div>
          
          {/* Bottom Section: Time Display */}
          <div className="mt-auto pt-2 border-t border-white/20 pb-2">
            <div className="bg-white/90 text-gray-800 text-xs font-bold rounded-lg px-2.5 py-1.5 shadow-sm border border-white/60 text-center relative group">
              {isEditing ? (
                <div className="flex gap-1 items-center">
                  <input
                    type="time"
                    className="bg-white text-gray-800 text-xs font-bold rounded px-1 py-0.5 border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 w-16"
                    value={`${Math.floor(editData.startTime).toString().padStart(2, '0')}:${((editData.startTime % 1) * 60).toString().padStart(2, '0')}`}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      setEditData({...editData, startTime: parseInt(hours) + parseInt(minutes) / 60});
                    }}
                  />
                  <span className="text-gray-800 font-bold">–</span>
                  <input
                    type="time"
                    className="bg-white text-gray-800 text-xs font-bold rounded px-1 py-0.5 border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 w-16"
                    value={`${Math.floor(editData.endTime).toString().padStart(2, '0')}:${((editData.endTime % 1) * 60).toString().padStart(2, '0')}`}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      setEditData({...editData, endTime: parseInt(hours) + parseInt(minutes) / 60});
                    }}
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-1">
                    <span>⏰ {formatTime(editData.startTime)} – {formatTime(editData.endTime)}</span>
                  </div>
                  
                  {/* Quick time adjustment buttons */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 rounded-lg shadow-lg border border-purple-200 p-1 flex gap-1">
                    <button
                      className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newData = {...editData, startTime: Math.max(0, editData.startTime - 0.5)};
                        handleTimeAdjustment(newData);
                      }}
                      title="Start -30min"
                    >
                      ⏪
                    </button>
                    <button
                      className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newData = {...editData, startTime: Math.min(23.5, editData.startTime + 0.5)};
                        handleTimeAdjustment(newData);
                      }}
                      title="Start +30min"
                    >
                      ⏩
                    </button>
                    <div className="w-px bg-gray-300 mx-1"></div>
                    <button
                      className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newData = {...editData, endTime: Math.max(editData.startTime + 0.5, editData.endTime - 0.5)};
                        handleTimeAdjustment(newData);
                      }}
                      title="End -30min"
                    >
                      ⏪
                    </button>
                    <button
                      className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newData = {...editData, endTime: Math.min(24, editData.endTime + 0.5)};
                        handleTimeAdjustment(newData);
                      }}
                      title="End +30min"
                    >
                      ⏩
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Drag handles for time adjustment */}
        {!isEditing && (
          <>
            {/* Top drag handle for start time */}
            <div
              className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-16 h-2 cursor-ns-resize opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-60 ${
                isDragging === 'start' ? 'opacity-100' : ''
              }`}
              onMouseDown={(e) => handleDragStart('start', e)}
              title="Drag to adjust start time"
            >
              <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-8 h-0.5 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Bottom drag handle for end time */}
            <div
              className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-2 cursor-ns-resize opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-60 ${
                isDragging === 'end' ? 'opacity-100' : ''
              }`}
              onMouseDown={(e) => handleDragStart('end', e)}
              title="Drag to adjust end time"
            >
              <div className="w-full h-full bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-8 h-0.5 bg-white rounded-full"></div>
              </div>
            </div>
          </>
        )}

        {/* Edit hint */}
        {!isEditing && (
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs bg-white/80 rounded px-1 py-0.5">✏️</span>
          </div>
        )}
      </div>

      {/* Connection handles (hidden by default) */}
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </>
  );
};

export default ClassNode;
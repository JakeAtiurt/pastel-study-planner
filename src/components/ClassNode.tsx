import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

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
}

const ClassNode = ({ data, selected }: ClassNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);

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
      peach: "bg-orange-100/80 border-orange-200 text-orange-900 shadow-orange-200/50"
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
          {/* Top Section: Icon and Course Code */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getEmojiIcon(editData.icon)}</span>
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
                <span className="text-sm font-bold tracking-wide">{editData.code}</span>
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
            <div className="bg-white/90 text-gray-800 text-xs font-bold rounded-lg px-2.5 py-1.5 shadow-sm border border-white/60 text-center">
              {isEditing ? (
                <div className="flex gap-1">
                  <input
                    type="time"
                    className="bg-transparent text-xs"
                    value={`${Math.floor(editData.startTime).toString().padStart(2, '0')}:${((editData.startTime % 1) * 60).toString().padStart(2, '0')}`}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      setEditData({...editData, startTime: parseInt(hours) + parseInt(minutes) / 60});
                    }}
                  />
                  <span>–</span>
                  <input
                    type="time"
                    className="bg-transparent text-xs"
                    value={`${Math.floor(editData.endTime).toString().padStart(2, '0')}:${((editData.endTime % 1) * 60).toString().padStart(2, '0')}`}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      setEditData({...editData, endTime: parseInt(hours) + parseInt(minutes) / 60});
                    }}
                  />
                </div>
              ) : (
                `${formatTime(editData.startTime)} – ${formatTime(editData.endTime)}`
              )}
            </div>
          </div>
        </div>

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
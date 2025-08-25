import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Background,
  Controls,
  NodeTypes,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ClassNode from './ClassNode';
import SaveLoadPanel from './SaveLoadPanel';
import { ScheduleData } from '../lib/supabase';
import { Toaster } from './ui/toaster';

// Custom node component without handles for day labels
const DayLabelNode = ({ data }: { data: { label: string } }) => (
  <div className="w-full h-full flex items-center justify-center">
    {data.label}
  </div>
);

// Custom node component for time labels with height editing
const TimeLabelNode = ({ data }: { data: { label: string; hour?: number; currentHeight?: number; onHeightChange?: (hour: number, height: number) => void } }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempHeight, setTempHeight] = useState(data.currentHeight || 60);
  
  useEffect(() => {
    setTempHeight(data.currentHeight || 60);
  }, [data.currentHeight]);
  
  return (
    <div 
      className="w-full h-full flex items-center justify-center cursor-pointer bg-gray-50/50 hover:bg-gray-100/50 rounded transition-colors border border-gray-200/50"
      onClick={() => {
        if (data.hour !== undefined) {
          setIsEditing(true);
        }
      }}
      title={data.hour !== undefined ? "Click to edit row height" : ""}
    >
      {isEditing && data.hour !== undefined ? (
        <div className="flex flex-col items-center gap-1 p-2">
          <input
            type="range"
            min="30"
            max="150"
            value={tempHeight}
            onChange={(e) => setTempHeight(parseInt(e.target.value))}
            className="w-12 h-1 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (data.onHeightChange && data.hour !== undefined) {
                  data.onHeightChange(data.hour, tempHeight);
                }
                setIsEditing(false);
              }}
              className="text-xs px-1 py-0.5 bg-green-100 hover:bg-green-200 text-green-700 rounded"
            >
              ✓
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTempHeight(data.currentHeight || 60);
                setIsEditing(false);
              }}
              className="text-xs px-1 py-0.5 bg-red-100 hover:bg-red-200 text-red-700 rounded"
            >
              ✕
            </button>
          </div>
          <span className="text-xs text-gray-600">{tempHeight}px</span>
        </div>
      ) : (
        <span className="text-sm">{data.label}</span>
      )}
    </div>
  );
};

interface ClassBlock {
  subject: string;
  code: string;
  section: string;
  startTime: number;
  endTime: number;
  color: string;
  icon: string;
  classroom?: string;
}

const InteractiveScheduleInner = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [startTime, setStartTime] = useState(8);
  const [endTime, setEndTime] = useState(18);
  const [timeFontSize, setTimeFontSize] = useState(12);
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});
  const skipNextAutoRegen = useRef(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);

  // Function to update row height
  const updateRowHeight = useCallback((hour: number, height: number) => {
    setRowHeights(prev => ({
      ...prev,
      [hour]: height
    }));
  }, []);

  const nodeTypes: NodeTypes = {
    classNode: (props: any) => <ClassNode {...props} id={props.id} />,
    dayLabel: DayLabelNode,
    timeLabel: (props: any) => (
      <TimeLabelNode 
        {...props} 
        data={{
          ...props.data,
          currentHeight: rowHeights[props.data.hour] || 60,
          onHeightChange: updateRowHeight
        }} 
      />
    ),
  };

  // Helper function to get row height for a specific hour
  const getRowHeight = (hour: number) => {
    return rowHeights[hour] || 60; // Default to 60px if not set
  };

  // Helper function to get cumulative Y position for a time
  const getYPosition = (time: number) => {
    let y = 100; // Starting Y position
    for (let hour = startTime; hour < time; hour++) {
      if (Number.isInteger(hour)) {
        y += getRowHeight(hour);
      } else {
        // For fractional hours, calculate proportional height
        const baseHour = Math.floor(hour);
        const fraction = hour - baseHour;
        y += getRowHeight(baseHour) * fraction;
      }
    }
    return y;
  };

  // Convert schedule data to React Flow nodes
  const createInitialNodes = () => {
    const scheduleData = {
      Monday: [
        { subject: "Intro to Modern Information Technology", code: "TSE101", section: "810001", startTime: 9.5, endTime: 12.5, color: "mint", icon: "technology", classroom: "EGR301" }
      ],
      Tuesday: [
        { subject: "Physics for Engineering", code: "SC133", section: "010002", startTime: 8, endTime: 9.5, color: "pink", icon: "physics", classroom: "SC4020" },
        { subject: "Critical Thinking", code: "LAS101", section: "230009", startTime: 9.5, endTime: 12.5, color: "yellow", icon: "thinking", classroom: "SC1012" },
        { subject: "Physics (Piyamon)", code: "SC133", section: "Extra", startTime: 14, endTime: 16, color: "pink", icon: "physics", classroom: "Extra" },
        { subject: "Ethics for Engineers", code: "TSE100", section: "", startTime: 17, endTime: 19, color: "purple", icon: "ethics", classroom: "SC3-413" }
      ],
      Wednesday: [
        { subject: "Fundamental of Calculus", code: "MA111", section: "070003", startTime: 9.5, endTime: 11, color: "blue", icon: "math", classroom: "SC3006" },
        { subject: "Fundamental Chemistry", code: "SC123", section: "080001", startTime: 11, endTime: 12.5, color: "lavender", icon: "chemistry", classroom: "SC3049" },
        { subject: "Engineering Graphics", code: "ME100", section: "908802", startTime: 13.5, endTime: 15.5, color: "peach", icon: "engineering", classroom: "EGR311" },
        { subject: "Engineering Graphics", code: "ME100", section: "908802", startTime: 15.5, endTime: 18.5, color: "peach", icon: "engineering", classroom: "EGR503" }
      ],
      Thursday: [
        { subject: "Physics for Engineering", code: "SC133", section: "010002", startTime: 8, endTime: 9.5, color: "pink", icon: "physics", classroom: "SC4020" },
        { subject: "Physics Lab", code: "SC183", section: "003201", startTime: 9.5, endTime: 12.5, color: "mint", icon: "physics", classroom: "Lab" },
        { subject: "Innovation and Entrepreneurial Mindset", code: "TU109", section: "540001", startTime: 13.5, endTime: 16.5, color: "orange", icon: "innovation", classroom: "SC3-413" },
        { subject: "Physics (Piyamon)", code: "SC133", section: "Extra", startTime: 17, endTime: 19, color: "pink", icon: "physics", classroom: "Extra" }
      ],
      Friday: [
        { subject: "Fundamental of Calculus", code: "MA111", section: "070003", startTime: 9.5, endTime: 11, color: "blue", icon: "math", classroom: "SC3006" },
        { subject: "Fundamental Chemistry", code: "SC123", section: "080001", startTime: 11, endTime: 12.5, color: "lavender", icon: "chemistry", classroom: "SC3049" },
        { subject: "Chemistry Lab", code: "SC173", section: "009101", startTime: 13.5, endTime: 16.5, color: "lavender", icon: "chemistry", classroom: "Lab" },
        { subject: "Calculus (Piyamon)", code: "MA111", section: "Extra", startTime: 17, endTime: 19, color: "blue", icon: "math", classroom: "Extra" }
      ],
      Saturday: [],
      Sunday: []
    };

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const nodes: Node[] = [];
    let nodeId = 1;

    // Create day header nodes
    days.forEach((day, dayIndex) => {
      nodes.push({
        id: `day-${dayIndex}`,
        type: 'dayLabel',
        position: { x: dayIndex * 220 + 100, y: 50 },
        data: { label: day },
        draggable: false,
        selectable: false,
        style: {
          background: 'linear-gradient(135deg, #E8D5F5, #F8E8F5)',
          border: '2px solid #D1B3E8',
          borderRadius: '16px',
          color: '#7C3AED',
          fontWeight: 'bold',
          width: 200,
          height: 60,
        }
      });
    });

    // Create time grid background with individual row heights
    for (let hour = startTime; hour <= endTime; hour++) {
      const yPos = getYPosition(hour);
      nodes.push({
        id: `time-${hour}`,
        type: 'timeLabel',
        position: { x: 20, y: yPos },
        data: { label: `${hour}:00`, hour }, // Include hour for reference
        draggable: false,
        selectable: false,
        style: {
          background: 'transparent',
          border: 'none',
          color: '#9CA3AF',
          fontSize: `${timeFontSize}px`,
          width: 50,
          height: getRowHeight(hour),
        }
      });
    }

    // Create class nodes
    days.forEach((day, dayIndex) => {
      const dayClasses = scheduleData[day as keyof typeof scheduleData];
      dayClasses.forEach((classBlock: ClassBlock, classIndex: number) => {
        const yPosition = getYPosition(classBlock.startTime);
        const endY = getYPosition(classBlock.endTime);
        const height = endY - yPosition;
        
        nodes.push({
          id: `class-${nodeId++}`,
          type: 'classNode',
          position: { 
            x: dayIndex * 220 + 100, 
            y: yPosition 
          },
          data: classBlock as any,
          style: {
            width: 180,
            height: Math.max(height, 160),
          },
          // Enable full dragging by not restricting drag handle
        });
      });
    });

    return nodes;
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes when time range, font size, or row heights change
  const updateTimeRange = useCallback(() => {
    setNodes(createInitialNodes());
  }, [startTime, endTime, timeFontSize, rowHeights]);

  useEffect(() => {
    if (skipNextAutoRegen.current) {
      skipNextAutoRegen.current = false;
      return;
    }
    updateTimeRange();
  }, [startTime, endTime, timeFontSize, rowHeights, updateTimeRange]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const addNewClass = useCallback(() => {
    const newNode: Node = {
      id: `class-${Date.now()}`,
      type: 'classNode',
      position: { x: 300, y: 200 }, // Default position
      data: {
        subject: 'New Class',
        code: 'NEW101',
        section: '001',
        startTime: 9,
        endTime: 10.5,
        color: 'blue',
        icon: 'default',
        classroom: 'TBD',
      } as any,
      style: {
        width: 180,
        height: 160,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const duplicateNode = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const nodeToDuplicate = nds.find((n) => n.id === nodeId);
      if (!nodeToDuplicate || nodeToDuplicate.type !== 'classNode') return nds;

      const newNode: Node = {
        ...nodeToDuplicate,
        id: `class-${Date.now()}`,
        position: {
          x: nodeToDuplicate.position.x + 20,
          y: nodeToDuplicate.position.y + 20,
        },
      };

      return [...nds, newNode];
    });
    setContextMenu(null);
  }, [setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setContextMenu(null);
  }, [setNodes]);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    
    if (node.type === 'classNode') {
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
      });
    }
  }, []);

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Save/Load functions
  const handleSave = useCallback(() => {
    const currentNodes = (reactFlowInstance?.getNodes?.() as any[]) || nodes;
    return {
      nodes: currentNodes,
      settings: {
        startTime,
        endTime,
        timeFontSize,
        rowHeights
      }
    };
  }, [nodes, startTime, endTime, timeFontSize, rowHeights, reactFlowInstance]);

  const handleLoad = useCallback((data: ScheduleData) => {
    skipNextAutoRegen.current = true;
    setNodes(data.nodes as any);
    setStartTime(data.settings.startTime);
    setEndTime(data.settings.endTime);
    setTimeFontSize(data.settings.timeFontSize);
    setRowHeights(data.settings.rowHeights || {});
  }, [setNodes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Add Button */}
        <div className="text-center mb-6 relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
            🎀 Interactive Uni Schedule 🎀
          </h1>
          <p className="text-gray-600 text-lg">Drag, resize, and edit your classes! ✨</p>
          <p className="text-sm text-gray-500 mt-2">💡 Double-click to edit • Drag to move • Select and resize • Right-click to delete</p>
          
          {/* Time Range Controls */}
          <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50">
            <div className="text-sm font-semibold text-purple-700 mb-3">📅 Schedule Hours</div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-600 mb-1">Start</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(parseInt(e.target.value))}
                  className="w-16 px-2 py-1 text-sm border border-purple-200 rounded-md text-center bg-white"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{i}:00</option>
                  ))}
                </select>
              </div>
              <div className="text-purple-400">—</div>
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-600 mb-1">End</label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(parseInt(e.target.value))}
                  className="w-16 px-2 py-1 text-sm border border-purple-200 rounded-md text-center bg-white"
                >
                  {Array.from({ length: 24 - startTime }, (_, i) => (
                    <option key={startTime + i + 1} value={startTime + i + 1}>{startTime + i + 1}:00</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Font Size and Height Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-600 mb-1">Font Size</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="8"
                    max="20"
                    value={timeFontSize}
                    onChange={(e) => setTimeFontSize(parseInt(e.target.value))}
                    className="w-16 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 w-8">{timeFontSize}px</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-600 mb-1">Row Heights</label>
                <div className="text-xs text-center text-gray-500">
                  <p>Independent row heights</p>
                  <p>Edit by clicking time labels</p>
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="absolute top-0 right-0 flex gap-3">
            <SaveLoadPanel onSave={handleSave} onLoad={handleLoad} />
            <button
              onClick={addNewClass}
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            >
              ➕ Add Class
            </button>
          </div>
        </div>

        {/* Interactive Schedule */}
        <div 
          className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
          style={{ height: '800px' }}
        >
          <div ref={reactFlowWrapper} className="w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onNodeContextMenu={onNodeContextMenu}
              nodeTypes={nodeTypes}
              fitView
              snapToGrid={true}
              snapGrid={[20, 20]}
              style={{ background: 'transparent' }}
              deleteKeyCode={['Backspace', 'Delete']}
              nodesDraggable={true}
              nodesConnectable={false}
            >
              <Background gap={30} size={1} color="#E5E7EB" />
              <Controls 
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #E8D5F5',
                  borderRadius: '12px',
                }}
              />
            </ReactFlow>
          </div>
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <div
            className="fixed bg-white shadow-lg border border-gray-200 rounded-lg py-2 z-50"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
              onClick={() => duplicateNode(contextMenu.nodeId)}
            >
              📋 Duplicate
            </button>
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600 flex items-center gap-2"
              onClick={() => deleteNode(contextMenu.nodeId)}
            >
              🗑️ Delete
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
          <h3 className="text-lg font-semibold text-center mb-4 text-purple-700">How to Use ✨</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <span className="text-2xl block mb-2">🖱️</span>
              <p><strong>Move:</strong> Drag any class block anywhere</p>
            </div>
            <div className="text-center">
              <span className="text-2xl block mb-2">📏</span>
              <p><strong>Resize:</strong> Select a class and drag corners</p>
            </div>
            <div className="text-center">
              <span className="text-2xl block mb-2">✏️</span>
              <p><strong>Edit:</strong> Double-click any class to edit</p>
            </div>
            <div className="text-center">
              <span className="text-2xl block mb-2">🗑️</span>
              <p><strong>Delete:</strong> Right-click and confirm deletion</p>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default InteractiveScheduleInner;

import React, { useCallback, useRef, useState } from 'react';
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
  MiniMap,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ClassNode from './ClassNode';

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

const nodeTypes: NodeTypes = {
  classNode: ClassNode,
};

const InteractiveSchedule = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Convert schedule data to React Flow nodes
  const createInitialNodes = () => {
    const scheduleData = {
      Monday: [],
      Tuesday: [
        { subject: "Physics for Engineering", code: "SC133", section: "010001", startTime: 8, endTime: 9.5, color: "pink", icon: "physics", classroom: "SC4001" },
        { subject: "Critical Thinking", code: "LAS101", section: "230009", startTime: 9.5, endTime: 12.5, color: "mint", icon: "thinking", classroom: "SC1012" }
      ],
      Wednesday: [
        { subject: "Fundamental of Calculus", code: "MA111", section: "070003", startTime: 9.5, endTime: 11, color: "blue", icon: "math", classroom: "SC3006" },
        { subject: "Fundamental Chemistry", code: "SC123", section: "080001", startTime: 11, endTime: 12.5, color: "lavender", icon: "chemistry", classroom: "SC3049" },
        { subject: "Engineering Graphics", code: "ME100", section: "908802", startTime: 13.5, endTime: 15.5, color: "peach", icon: "engineering", classroom: "EGR311" },
        { subject: "Engineering Graphics", code: "ME100", section: "908802", startTime: 15.5, endTime: 18.5, color: "peach", icon: "engineering", classroom: "EGR503" }
      ],
      Thursday: [
        { subject: "Physics for Engineering", code: "SC133", section: "010001", startTime: 8, endTime: 9.5, color: "pink", icon: "physics", classroom: "SC4001" },
        { subject: "Physics Lab", code: "SC183", section: "003201", startTime: 9.5, endTime: 12.5, color: "pink", icon: "physics" },
        { subject: "Innovation and Entrepreneurial Mindset", code: "TU109", section: "540001", startTime: 13.5, endTime: 16.5, color: "yellow", icon: "innovation", classroom: "SC3-413" }
      ],
      Friday: [
        { subject: "Fundamental of Calculus", code: "MA111", section: "070003", startTime: 9.5, endTime: 11, color: "blue", icon: "math", classroom: "SC3006" },
        { subject: "Fundamental Chemistry", code: "SC123", section: "080001", startTime: 11, endTime: 12.5, color: "lavender", icon: "chemistry", classroom: "SC3049" },
        { subject: "Chemistry Lab", code: "SC173", section: "009101", startTime: 13.5, endTime: 16.5, color: "lavender", icon: "chemistry" }
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
        type: 'default',
        position: { x: dayIndex * 200 + 100, y: 50 },
        data: { label: day },
        draggable: false,
        selectable: false,
        style: {
          background: 'linear-gradient(135deg, #E8D5F5, #F8E8F5)',
          border: '2px solid #D1B3E8',
          borderRadius: '16px',
          color: '#7C3AED',
          fontWeight: 'bold',
          width: 150,
          height: 40,
        }
      });
    });

    // Create time grid background
    for (let hour = 8; hour <= 18; hour++) {
      nodes.push({
        id: `time-${hour}`,
        type: 'default',
        position: { x: 20, y: 100 + (hour - 8) * 60 },
        data: { label: `${hour}:00` },
        draggable: false,
        selectable: false,
        style: {
          background: 'transparent',
          border: 'none',
          color: '#9CA3AF',
          fontSize: '12px',
          width: 50,
          height: 30,
        }
      });
    }

    // Create class nodes
    days.forEach((day, dayIndex) => {
      const dayClasses = scheduleData[day as keyof typeof scheduleData];
      dayClasses.forEach((classBlock: ClassBlock, classIndex: number) => {
        const yPosition = 100 + (classBlock.startTime - 8) * 60;
        const height = (classBlock.endTime - classBlock.startTime) * 60;
        
        nodes.push({
          id: `class-${nodeId++}`,
          type: 'classNode',
          position: { 
            x: dayIndex * 200 + 100, 
            y: yPosition 
          },
          data: classBlock as any,
          style: {
            width: 180,
            height: Math.max(height, 160),
          },
          dragHandle: '.drag-handle',
        });
      });
    });

    return nodes;
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `new-${Date.now()}`,
        type: 'classNode',
        position,
        data: {
          subject: 'New Class',
          code: 'NEW101',
          section: '001',
          startTime: 9,
          endTime: 10.5,
          color: 'blue',
          icon: 'default',
          classroom: 'TBD',
        },
        style: {
          width: 180,
          height: 160,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
            🎀 Interactive Uni Schedule 🎀
          </h1>
          <p className="text-gray-600 text-lg">Drag, resize, and edit your classes! ✨</p>
          <p className="text-sm text-gray-500 mt-2">💡 Double-click any class to edit • Drag to move • Select and resize</p>
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
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              snapToGrid={true}
              snapGrid={[15, 15]}
              style={{ background: 'transparent' }}
              deleteKeyCode={['Backspace', 'Delete']}
            >
              <Background gap={30} size={1} color="#E5E7EB" />
              <Controls 
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #E8D5F5',
                  borderRadius: '12px',
                }}
              />
              <MiniMap 
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #E8D5F5',
                  borderRadius: '12px',
                }}
                nodeColor="#E8D5F5"
              />
            </ReactFlow>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
          <h3 className="text-lg font-semibold text-center mb-4 text-purple-700">How to Use ✨</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <span className="text-2xl block mb-2">🖱️</span>
              <p><strong>Move:</strong> Drag any class block to reposition it</p>
            </div>
            <div className="text-center">
              <span className="text-2xl block mb-2">📏</span>
              <p><strong>Resize:</strong> Select a class and drag the corners to resize</p>
            </div>
            <div className="text-center">
              <span className="text-2xl block mb-2">✏️</span>
              <p><strong>Edit:</strong> Double-click any class to edit details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveSchedule;
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import InteractiveScheduleInner from './InteractiveScheduleInner';

const InteractiveSchedule = () => {
  return (
    <ReactFlowProvider>
      <InteractiveScheduleInner />
    </ReactFlowProvider>
  );
};

export default InteractiveSchedule;
import React, { useEffect } from 'react';
import { ReactFlow, Background, Controls, useNodesState } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import type { ProcessStep } from '../hooks/useProcessSteps';
import '@xyflow/react/dist/style.css';

interface ProcessStepNodeMapProps {
  processSteps: ProcessStep[];
}

const ProcessStepNodeMap: React.FC<ProcessStepNodeMapProps> = ({ processSteps }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);

  useEffect(() => {
    // 공정 유형별 테마 색상 정의 (Aesthetics 적용)
    const getTypeStyles = (type: string) => {
      switch (type) {
        case '생산':
          return {
            background: 'rgba(16, 185, 129, 0.1)',
            border: '2px solid #10b981',
            color: '#34d399',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)',
          };
        case '포장':
          return {
            background: 'rgba(99, 102, 241, 0.15)',
            border: '2px solid #6366f1',
            color: '#818cf8',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)',
          };
        case '검사':
          return {
            background: 'rgba(245, 158, 11, 0.1)',
            border: '2px solid #f59e0b',
            color: '#fbbf24',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)',
          };
        default:
          return {
            background: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
          };
      }
    };

    // 정렬 순서(seqNo)에 맞게 정렬 후 가로 배치 좌표 매핑
    const sortedSteps = [...processSteps].sort((a, b) => a.seqNo - b.seqNo);
    const initialNodes: Node[] = sortedSteps.map((step, index) => {
      const typeStyle = getTypeStyles(step.stepType);
      return {
        id: step.stepID.toString(),
        type: 'default',
        data: {
          label: (
            <div style={{ padding: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '4px' }}>
                Seq {step.seqNo} (ID: {step.stepID})
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '4px' }}>
                {step.stepName}
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                [{step.stepType}]
              </div>
            </div>
          ),
        },
        position: { x: index * 260 + 50, y: 150 },
        style: {
          ...typeStyle,
          borderRadius: '12px',
          padding: '12px',
          width: 180,
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      };
    });

    setNodes(initialNodes);
  }, [processSteps, setNodes]);

  return (
    <div className="premium-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>공정 노드 시각화 맵</h3>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            각 공정 단계를 마우스로 드래그하여 자유롭게 배치해 볼 수 있습니다. (정렬 순서대로 정렬됨)
          </p>
        </div>
      </div>
      
      <div style={{ 
        width: '100%', 
        height: 'calc(100vh - 380px)', 
        minHeight: '450px',
        background: '#0d0e12', 
        borderRadius: '12px', 
        border: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <ReactFlow
          nodes={nodes}
          edges={[]}
          onNodesChange={onNodesChange}
          fitView
          colorMode="dark"
        >
          <Background color="#333" gap={16} size={1} />
          <Controls style={{ background: '#1f2026', border: '1px solid var(--border-color)', color: 'white' }} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ProcessStepNodeMap;

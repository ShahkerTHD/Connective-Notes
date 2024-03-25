import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 400, y: 200 }, data: { label: 'Hello World' } },
  { id: '2', position: { x: 500, y: 300 }, data: { label: 'Welcome!' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true, style: { stroke: 'blue' } }];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [textInput, setTextInput] = useState("");
  const [lineType, setLineType] = useState("smoothstep");
  const [isAnimated, setIsAnimated] = useState(true);
  const [theme, setTheme] = useState('light');
  const [showInstructions, setShowInstructions] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (showInstructions && fadeOut) {
      setTimeout(() => {
        setShowInstructions(false);
      }, 300);
    }
  }, [showInstructions, fadeOut]);

  const onConnect = useCallback((params) => {
    let strokeColor;
    switch (lineType) {
      case 'straight':
        strokeColor = 'red';
        break;
      case 'step':
        strokeColor = 'green';
        break;
      case 'smoothstep':
        strokeColor = 'blue';
        break;
      case 'bezier':
        strokeColor = 'purple';
        break;
      default:
        strokeColor = 'black';
    }
    setEdges((eds) => addEdge({ ...params, type: lineType, animated: isAnimated, style: { stroke: strokeColor } }, eds));
  }, [setEdges, lineType, isAnimated]);

  const handleAddNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      position: { x: 0, y: 0 },
      data: { label: textInput }
    };

    setNodes((ns) => [...ns, newNode]);
  };

  const handleLineTypeChange = (event) => {
    setLineType(event.target.value);
  };

  const handleAnimationChange = (event) => {
    setIsAnimated(event.target.checked);
  };

  const handleThemeChange = () => {
    setTheme((prevTheme) => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleExport = () => {
    const data = { nodes, edges };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Cnotes.json';
    link.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = JSON.parse(event.target.result);
      setNodes(data.nodes);
      setEdges(data.edges);
    };
    reader.readAsText(file);
  };

  const handleFadeOut = () => {
    setFadeOut(true);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: theme === 'light' ? 'white' : 'black', color: theme === 'light' ? 'black' : 'white' }}>
      {showInstructions && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '2rem', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', borderRadius: '10px', transition: 'opacity 0.5s', opacity: fadeOut ? 0 : 1, display: fadeOut ? 'none' : 'block', zIndex: '999' }}>
          <h3>Welcome to ConnectiveNotes 👋 :</h3>
          <p>Start by typing in the text box and press enter.
            You can drag nodes and select the type of line.
            Have fun Noting! Heres a Tutoriel:</p>
          <button onClick={handleFadeOut} style={{ padding: '1rem', backgroundColor: 'lightgrey', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Got it!</button>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
        <input
          type="text"
          value={textInput}
          onChange={(event) => setTextInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleAddNode();
              setTextInput("");
            }
          }}
          placeholder="Click me and start Typing"
          className="glassmorphism-input"
          style={{ marginRight: '10px', color: theme === 'light' ? 'black' : 'white' }}
        />
        <select value={lineType} onChange={handleLineTypeChange} className="glassmorphism-dropdown" style={{ marginRight: '10px', color: theme === 'light' ? 'black' : 'white' }}>
          <option value="straight">Straight</option>
          <option value="step">Step</option>
          <option value="smoothstep">Smooth Step</option>
          <option value="bezier">Bezier</option>
        </select>
        <label className="glassmorphism-button" style={{ marginRight: '10px', color: theme === 'light' ? 'black' : 'white' }}>
          <input type="checkbox" checked={isAnimated} onChange={handleAnimationChange} />
          Animate Line
        </label>
        <button onClick={handleThemeChange}>Toggle Theme</button>
        <button onClick={handleExport} className="glassmorphism-button">Export</button>
        <input type="file" onChange={handleImport} className="glassmorphism-button" />
      </div>
    </div>
  );
}

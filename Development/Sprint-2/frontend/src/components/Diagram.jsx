import { useCallback, useState, useEffect, useMemo } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges} from 'reactflow';
import 'reactflow/dist/style.css';

import TextUpdaterNode from './SchemaNode';

const Diagram = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  const [variant, setVariant] = useState('cross');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/schema/get_schema`);
        if (!response.ok) {
          alert("Unable to generate schema");
          throw new Error('Failed to fetch data');
        }
        const apiData = await response.json();
        let edges = [];
        const initialNodes = apiData.data.map(([collection, { concrete, loose }]) => ({
          id: `node-${collection}`,
          type: 'textUpdater',
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          data: { collection, concrete, loose }
        }));
        setNodes(initialNodes);
        for(let i = 0; i < apiData.data.length; i++) {
          for(let key in apiData.data[i][1].concrete) {
            if(apiData.data[i][1].concrete[key] == null || apiData.data[i][1].concrete[key] == undefined ) {
              continue
            }
            if(apiData.data[i][1].concrete[key].includes('--->')) {
              let [n1, n2] = apiData.data[i][1].concrete[key].split(' ---> ');
              edges.push({
                id: key,
                source: `node-${apiData.data[i][0]}`,
                target: `node-${n2}`
              })
            }
            
          }
          for(let key in apiData.data[i][1].loose){
            if(apiData.data[i][1].loose[key] == null || apiData.data[i][1].loose[key] == undefined ) {
              continue
            }
            if(apiData.data[i][1].loose[key].includes('--->')) {
              let [n1, n2] = apiData.data[i][1].loose[key].split(' ---> ');
              edges.push({
                id: key,
                source: `node-${apiData.data[i][0]}`,
                target: `node-${n2}`
              })
            }
          }
        }
        setEdges(edges);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        alert("Unable to generate schema")
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false on error
      }
    };
    fetchData();
  }, []);

  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div className='w-screen h-screen bg-black-500'>
      {loading ? ( // Conditional rendering based on loading state
        <div className="flex items-center justify-center w-full h-full">
          <div className="spinner-simple"></div> {/* Show spinner */}
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        />
      )}
    </div>
  );
}

export default Diagram;

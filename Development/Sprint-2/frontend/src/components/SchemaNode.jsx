import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
 
const handleStyle = { left: 10 };
 
function TextUpdaterNode({ data }) {
  const onChange = useCallback((evt) => {
  }, []);
 
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className='w-auto h-auto border border-gray-500 p-2 rounded bg-white'>
      <table className="border border-gray-300 p-2 rounded text-black">
        <tbody>
          <tr>
            <td colSpan="2" className="text-center">
              {data.collection}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Field</strong>
            </td>
            <td>
              <strong>Type</strong>
            </td>
          </tr>
          {data.concrete.map((fieldType, index) => {
            const [field, type] = fieldType.split(" : ");
            return (
              <tr key={index}>
                <td>{field}</td>
                <td>{type}</td>
              </tr>
            );
          })}
          {data.loose.length > 0 && (
            <>
              <tr>
                <td colSpan="2">
                  <strong>Loose</strong>
                </td>
              </tr>
              {data.loose.map((fieldType, index) => {
                const [field, type] = fieldType.split(" : ");
                return (
                  <tr key={index}>
                    <td>{field}</td>
                    <td>{type}</td>
                  </tr>
                );
              })}
            </>
          )}
        </tbody>
      </table>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
    </>
  );
}
export default TextUpdaterNode;
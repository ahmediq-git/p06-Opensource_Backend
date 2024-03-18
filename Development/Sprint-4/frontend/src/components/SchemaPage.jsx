import React, { useEffect, useState } from 'react';
import DiagramComponent from './Diagram';

const SchemaComponent = () => {
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/schema/get_schema`)
      .then(response => response.json())
      .then(data => setJsonData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      {jsonData && <DiagramComponent jsonData={jsonData} />}
    </div>
  );
};

export default SchemaComponent;

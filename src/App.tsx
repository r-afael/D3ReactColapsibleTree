import React, { useState } from 'react';
import D3TreeComponent from './D3TreeComponent';
import { Box, Flex } from 'gestalt';

const App: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Collapse Tree Visualization' : 'Expand Tree Visualization'}
      </button>
      {isExpanded && (
        <div style={{ padding: '10px', border: '1px solid black' }}>
          <Box maxHeight={500}>
            <Flex>

        
          <D3TreeComponent />
          </Flex>
          </Box>
        </div>
      )}
    </div>
  );
};

export default App;

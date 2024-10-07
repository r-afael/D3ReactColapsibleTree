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
        <Box
          maxHeight={500}         // Constrain the height
          height={500}            // Explicitly set the height to 500px
          borderStyle="lg"        // Set the border style (options: sm, lg, shadow)          // Optional: Set background color to ensure visibility
        >
          <Flex height="100%">    {/* Ensure Flex takes full height */}
            <D3TreeComponent />
          </Flex>
        </Box>
      )}
    </div>
  );
};

export default App;

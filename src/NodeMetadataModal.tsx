import React from 'react';
import { Modal, Box, Text, Button } from 'gestalt';
import { CustomHierarchyPointNode } from './D3TreeComponent';

interface NodeMetadataModalProps {
  node: CustomHierarchyPointNode;
  onClose: () => void;
}

const NodeMetadataModal: React.FC<NodeMetadataModalProps> = ({ node, onClose }) => {
  return (
    <Modal
      accessibilityModalLabel="Node Details"
      onDismiss={onClose}
      heading={node.data.name}
      size="md"
    >
      <Box padding={4}>
        <Text>{node.data.metadata || 'No metadata available.'}</Text>
        <Box marginTop={4}>
          <Button text="Close" onClick={onClose} />
        </Box>
      </Box>
    </Modal>
  );
};

export default NodeMetadataModal;

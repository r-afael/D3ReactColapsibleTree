import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, IconButton, Layer, FixedZIndex, CompositeZIndex } from 'gestalt';
import NodeMetadataModal from './NodeMetadataModal'; // Import the separate modal component

export interface TreeNode {
  name: string;
  metadata?: string; // Metadata field
  children?: TreeNode[];
  id?: number | string;
  textWidth?: number;
}

export interface CustomHierarchyPointNode extends d3.HierarchyPointNode<TreeNode> {
  x0?: number;
  y0?: number;
  _children?: CustomHierarchyPointNode[];
  textWidth?: number;
}

const rootNodes: TreeNode[] = [
  {
    name: 'Root 1',
    metadata: 'Metadata for Root 1',
    children: [
      { name: 'Child 1.1', metadata: 'Metadata for Child 1.1' },
      { name: 'Child 1.2', metadata: 'Metadata for Child 1.2' },
    ],
  },
  {
    name: 'Root 2',
    metadata: 'Metadata for Root 2',
    children: [
      { name: 'Child 2.1', metadata: 'Metadata for Child 2.1' },
      { name: 'Child 2.2', metadata: 'Metadata for Child 2.2' },
    ],
  },
  {
    name: 'Root 3',
    metadata: 'Metadata for Root 3',
    children: [
      {
        name: 'Child 3.1',
        metadata: 'Metadata for Child 3.1',
        children: [
          { name: 'Child 3.1.1', metadata: 'Metadata for Child 3.1.1' },
          { name: 'Child 3.1.2', metadata: 'Metadata for Child 3.1.2' },
        ],
      },
      { name: 'Child 3.2', metadata: 'Metadata for Child 3.2' },
    ],
  },
  // Add more root nodes as needed
];

const virtualRootNode: TreeNode = {
  name: 'virtual_root',
  children: rootNodes,
};

const D3TreeComponent: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // State for the selected node
  const [selectedNode, setSelectedNode] = useState<CustomHierarchyPointNode | null>(null);

  // Store the zoom behavior and initial transform to reset later
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const initialTransformRef = useRef<d3.ZoomTransform | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return; // Ensure refs are not null

    // Get container dimensions
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const dx = 100; // Vertical spacing between nodes
    const dy = 100; // Horizontal spacing between nodes

    // Create a new tree layout
    const tree = d3.tree<TreeNode>().nodeSize([dy, dx]);

    const diagonal = d3
      .linkVertical<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
      .x((d) => d.x)
      .y((d) => d.y);

    // Create the root node
    const root = d3.hierarchy<TreeNode>(virtualRootNode) as CustomHierarchyPointNode;
    root.x0 = containerWidth / 2;
    root.y0 = 0;

    // Collapse all children except root nodes
    root.descendants().forEach((d: CustomHierarchyPointNode, i) => {
      d.data.id = i;
      d._children = d.children;
      if (d.depth === 1) {
        // Expand first-level children (actual root nodes)
        d.children = d._children;
      } else if (d.depth > 1) {
        // Collapse deeper levels
        d.children = undefined;
      }
    });

    // Clear previous SVG content if exists
    d3.select(svgRef.current).selectAll('*').remove();

    // Create the SVG container with responsive dimensions
    const svg = d3
      .select(svgRef.current as SVGSVGElement)
      .attr('width', '100%')
      .attr('height', '100%')
      .style('font', '12px sans-serif')
      .style('user-select', 'none');

    // Create a container group that will hold all other groups
    const containerGroup = svg.append('g');

    // Define zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4]) // Adjust the scale extent as needed
      .on('zoom', zoomed);

    // Store the zoom behavior for later use
    zoomBehaviorRef.current = zoom;

    function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
      containerGroup.attr('transform', event.transform.toString());
    }

    // Apply zoom behavior to SVG
    svg.call(zoom).on('dblclick.zoom', null); // Disable double-click zoom if desired

    // Now, append gLink and gNode to containerGroup
    const gLink = containerGroup
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5);

    const gNode = containerGroup
      .append('g')
      .attr('cursor', 'pointer')
      .attr('pointer-events', 'all');

    function update(source: CustomHierarchyPointNode) {
      const duration = 250;

      // Compute the new tree layout
      tree(root);

      // Get nodes and links, excluding the virtual root
      const nodes = root.descendants().slice(1) as CustomHierarchyPointNode[];
      const links = root.links().filter((d) => d.source.depth > 0 && d.target.depth > 0);

      // Adjust positions
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      nodes.forEach((d) => {
        if (d.x < minX) minX = d.x;
        if (d.x > maxX) maxX = d.x;
        if (d.y < minY) minY = d.y;
        if (d.y > maxY) maxY = d.y;
      });

      // Compute the tree's dimensions
      const treeWidth = maxX - minX + margin.left + margin.right;
      const treeHeight = maxY - minY + margin.top + margin.bottom;

      // Center the nodes
      nodes.forEach((d) => {
        d.x = d.x - minX + margin.left;
        d.y = d.y - minY + margin.top;
      });

      // Update the initial transform to center the tree
      const scaleX = containerWidth / treeWidth;
      const scaleY = containerHeight / treeHeight;
      const scale = Math.min(scaleX, scaleY);

      const translateX = (containerWidth - treeWidth * scale) / 2;
      const translateY = (containerHeight - treeHeight * scale) / 2;

      if (source === root) {
        const initialTransform = d3.zoomIdentity.translate(translateX, translateY).scale(scale);
        initialTransformRef.current = initialTransform; // Store it for resetting
        svg.call(zoom.transform, initialTransform);
      }

      // Create a standalone transition
      const transition = d3.transition().duration(duration);

      // Update the nodes
      const node = gNode
        .selectAll<SVGGElement, CustomHierarchyPointNode>('g')
        .data(nodes, (d) => d.data.id as string | number);

      const nodeEnter = node
        .enter()
        .append('g')
        .attr('transform', () => `translate(${source.x0 || 0},${source.y0 || 0})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

      // Rectangle for the node
      nodeEnter
        .append('rect')
        .attr('x', -50)
        .attr('y', -10)
        .attr('width', 100)
        .attr('height', 20)
        .attr('fill', (d) =>
          d._children || d.children ? '#555' : '#999'
        ) // Different color for expandable nodes
        .attr('stroke-width', 1)
        .attr('stroke', '#000')
        .attr('rx', 5)
        .attr('ry', 5)
        .on('click', function (event: any, d: CustomHierarchyPointNode) {
          event.stopPropagation();
          d.children = d.children ? undefined : d._children;
          update(d);
        });

      // Text inside the node
      nodeEnter
        .append('text')
        .attr('dy', '0.31em')
        .attr('text-anchor', 'middle')
        .text((d) => d.data.name)
        .attr('fill', 'white')
        .on('click', function (event: any, d: CustomHierarchyPointNode) {
          event.stopPropagation();
          d.children = d.children ? undefined : d._children;
          update(d);
        });

      // Metadata icon inside the node
      // Replace FontAwesome with an SVG path icon
      const infoIconPath =
        'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 ' +
        '10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s' +
        '3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v2h2V7zm0 ' +
        '4h-2v6h2v-6z';

      nodeEnter
        .append('path')
        .attr('d', infoIconPath)
        .attr('transform', 'translate(35, -10) scale(0.5)')
        .attr('fill', 'white')
        .on('click', function (event: any, d: CustomHierarchyPointNode) {
          event.stopPropagation();
          setSelectedNode(d); // Open the popup with node metadata
        });

      // Update positions and transitions
      const nodeUpdate = node
        .merge(nodeEnter as any)
        .transition(transition)
        .attr('transform', (d) => `translate(${d.x},${d.y})`)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1);

      const nodeExit = node
        .exit()
        .transition(transition)
        .remove()
        .attr('transform', () => `translate(${source.x || 0},${source.y || 0})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

      // Update the links
      const link = gLink
        .selectAll<SVGPathElement, d3.HierarchyPointLink<TreeNode>>('path')
        .data(links, (d) => d.target.data.id as string | number);

      const linkEnter = link
        .enter()
        .append('path')
        .attr('d', () => {
          const o = { x: source.x0 || 0, y: source.y0 || 0 };
          return diagonal({ source: o, target: o } as any);
        });

      link
        .merge(linkEnter as any)
        .transition(transition)
        .attr('d', (d) => diagonal(d as any));

      link
        .exit()
        .transition(transition)
        .remove()
        .attr('d', () => {
          const o = { x: source.x || 0, y: source.y || 0 };
          return diagonal({ source: o, target: o } as any);
        });

      // Stash the old positions for transition
      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Update the positions of the root node
      root.x0 = root.x;
      root.y0 = root.y;
    }

    update(root);
  }, []);

  // Function to reset the zoom and pan
  const resetZoom = () => {
    if (
      !svgRef.current ||
      !zoomBehaviorRef.current ||
      !containerRef.current ||
      !initialTransformRef.current
    )
      return;

    const svgSelection = d3.select(svgRef.current as SVGSVGElement);

    // Reset the zoom transform to the initial transform
    svgSelection
      .transition()
      .duration(750)
      .call((transition) => {
        zoomBehaviorRef.current!.transform(transition, initialTransformRef.current!);
      });
  };

  // ZIndex for the floating button
  const fixedZIndex = new FixedZIndex(1);
  const compositeZIndex = new CompositeZIndex([fixedZIndex]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
      {selectedNode && (
        <NodeMetadataModal node={selectedNode} onClose={() => setSelectedNode(null)} />
      )}
      <Layer zIndex={compositeZIndex}>
        <Box position="absolute" top right marginTop={2}>
          <IconButton
            accessibilityLabel="Reset Zoom"
            icon="refresh"
            onClick={resetZoom}
            size="md"
          />
        </Box>
      </Layer>
    </div>
  );
};

export default D3TreeComponent;

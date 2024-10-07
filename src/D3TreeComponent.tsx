import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TreeNode {
  name: string;
  children?: TreeNode[];
  id?: number | string;
  textWidth?: number;
}

interface CustomHierarchyPointNode extends d3.HierarchyPointNode<TreeNode> {
  x0?: number;
  y0?: number;
  _children?: CustomHierarchyPointNode[];
  textWidth?: number;
}

const rootNodes: TreeNode[] = [
    {
      name: 'Root 1',
      children: [{ name: 'Child 1.1' }, { name: 'Child 1.2' }],
    },
    {
      name: 'Root 2',
      children: [
        { name: 'Child 2.1' },
        {
          name: 'Child 2.2',
          children: [{ name: 'Grandchild 2.2.1' }, { name: 'Grandchild 2.2.2' }],
        },
      ],
    },
    {
      name: 'Root 3',
      children: [
        {
          name: 'Child 3.1',
          children: [
            { name: 'Grandchild 3.1.1' },
            {
              name: 'Grandchild 3.1.2',
              children: [{ name: 'Great-Grandchild 3.1.2.1' }],
            },
          ],
        },
        { name: 'Child 3.2' },
      ],
    },
    {
      name: 'Root 4',
      children: [{ name: 'Child 4.1' }],
    },
    {
      name: 'Root 5',
      children: [
        { name: 'Child 5.1' },
        { name: 'Child 5.2' },
        { name: 'Child 5.3' },
      ],
    },
    {
      name: 'Root 6',
      children: [
        {
          name: 'Child 6.1',
          children: [
            { name: 'Grandchild 6.1.1' },
            { name: 'Grandchild 6.1.2' },
            { name: 'Grandchild 6.1.3' },
          ],
        },
      ],
    },
    {
      name: 'Root 7',
      children: [
        {
          name: 'Child 7.1',
          children: [
            {
              name: 'Grandchild 7.1.1',
              children: [
                { name: 'Great-Grandchild 7.1.1.1' },
                { name: 'Great-Grandchild 7.1.1.2' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Root 8',
    },
    {
      name: 'Root 9',
      children: [
        { name: 'Child 9.1' },
        { name: 'Child 9.2' },
        { name: 'Child 9.3' },
        { name: 'Child 9.4' },
      ],
    },
    {
      name: 'Root 10',
      children: [
        {
          name: 'Child 10.1',
          children: [
            { name: 'Grandchild 10.1.1' },
            { name: 'Grandchild 10.1.2' },
          ],
        },
        {
          name: 'Child 10.2',
          children: [
            { name: 'Grandchild 10.2.1' },
            { name: 'Grandchild 10.2.2' },
            { name: 'Grandchild 10.2.3' },
          ],
        },
      ],
    },
    {
      name: 'Root 11',
      children: [{ name: 'Child 11.1' }],
    },
    {
      name: 'Root 12',
      children: [
        { name: 'Child 12.1' },
        {
          name: 'Child 12.2',
          children: [{ name: 'Grandchild 12.2.1' }],
        },
        {
          name: 'Child 12.3',
          children: [
            {
              name: 'Grandchild 12.3.1',
              children: [
                { name: 'Great-Grandchild 12.3.1.1' },
                { name: 'Great-Grandchild 12.3.1.2' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Root 13',
      children: [
        { name: 'Child 13.1' },
        { name: 'Child 13.2' },
      ],
    },
    {
      name: 'Root 14',
      children: [
        {
          name: 'Child 14.1',
          children: [
            { name: 'Grandchild 14.1.1' },
            { name: 'Grandchild 14.1.2' },
            { name: 'Grandchild 14.1.3' },
            { name: 'Grandchild 14.1.4' },
          ],
        },
      ],
    },
    {
      name: 'Root 15',
      children: [
        { name: 'Child 15.1' },
        { name: 'Child 15.2' },
        { name: 'Child 15.3' },
        { name: 'Child 15.4' },
        { name: 'Child 15.5' },
      ],
    },
    {
      name: 'Root 16',
      children: [
        {
          name: 'Child 16.1',
          children: [
            {
              name: 'Grandchild 16.1.1',
              children: [
                {
                  name: 'Great-Grandchild 16.1.1.1',
                  children: [{ name: 'Great-Great-Grandchild 16.1.1.1.1' }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Root 17',
      children: [{ name: 'Child 17.1' }],
    },
    {
      name: 'Root 18',
      children: [
        { name: 'Child 18.1' },
        {
          name: 'Child 18.2',
          children: [
            { name: 'Grandchild 18.2.1' },
            { name: 'Grandchild 18.2.2' },
          ],
        },
      ],
    },
    {
      name: 'Root 19',
      children: [
        { name: 'Child 19.1' },
        { name: 'Child 19.2' },
        { name: 'Child 19.3' },
      ],
    },
    {
      name: 'Root 20',
      children: [
        {
          name: 'Child 20.1',
          children: [
            {
              name: 'Grandchild 20.1.1',
              children: [
                { name: 'Great-Grandchild 20.1.1.1' },
                {
                  name: 'Great-Grandchild 20.1.1.2',
                  children: [
                    { name: 'Great-Great-Grandchild 20.1.1.2.1' },
                    { name: 'Great-Great-Grandchild 20.1.1.2.2' },
                  ],
                },
              ],
            },
          ],
        },
        { name: 'Child 20.2' },
      ],
    },
  ];
  

const virtualRootNode: TreeNode = {
  name: 'virtual_root',
  children: rootNodes,
};

const D3TreeComponent: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const initialWidth = 800;
    const initialHeight = 600;

    const margin = { top: 20, right: 120, bottom: 40, left: 120 };

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
    root.x0 = initialWidth / 2;
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

    // Create the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr('width', initialWidth)
      .attr('height', initialHeight)
      .style('font', '12px sans-serif')
      .style('user-select', 'none');

    const gLink = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5);

    const gNode = svg
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

      // Adjust vertical positions to move the tree upwards
      let minY = d3.min(nodes, (d) => d.y) || 0;
      nodes.forEach((d) => {
        d.y = d.y - minY + margin.top;
      });
      root.y = root.y - minY + margin.top;
      source.y0 = source.y0 ? source.y0 - minY + margin.top : margin.top;

      // Adjust horizontal positions to move the tree to the right
      let minX = d3.min(nodes, (d) => d.x) || 0;
      nodes.forEach((d) => {
        d.x = d.x - minX + margin.left;
      });
      root.x = root.x - minX + margin.left;
      source.x0 = source.x0 ? source.x0 - minX + margin.left : margin.left;

      // Compute the maximum x and y positions to determine the required SVG dimensions
      let maxX = d3.max(nodes, (d) => d.x) || 0;
      let maxY = d3.max(nodes, (d) => d.y) || 0;

      // Update the SVG dimensions and viewBox
      const svgWidth = maxX + margin.right;
      const svgHeight = maxY + margin.bottom;

      svg
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('viewBox', [0, 0, svgWidth, svgHeight] as any);

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
        .attr('stroke-opacity', 0)
        .on('click', (event: any, d: CustomHierarchyPointNode) => {
          d.children = d.children ? undefined : d._children;
          update(d);
        });

      // Add rectangle
      nodeEnter
        .append('rect')
        .attr('x', -50)
        .attr('y', -10)
        .attr('width', 100)
        .attr('height', 20)
        .attr('fill', (d) => (d._children ? '#555' : '#999'))
        .attr('stroke-width', 1)
        .attr('stroke', '#000')
        .attr('rx', 5)
        .attr('ry', 5);

      nodeEnter
        .append('text')
        .attr('dy', '0.31em')
        .attr('text-anchor', 'middle')
        .text((d) => d.data.name)
        .attr('fill', 'white');

      const nodeUpdate = node
        .merge(nodeEnter)
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
        .merge(linkEnter)
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

  return <svg ref={svgRef} />;
};

export default D3TreeComponent;

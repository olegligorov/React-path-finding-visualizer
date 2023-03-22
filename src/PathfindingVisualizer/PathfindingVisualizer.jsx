import React, { Component } from 'react'
import Node from '../Node/Node'

import './PathfindingVisualizer.css'

import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';

const START_NODE_ROW = 6;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 45;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      wallMode: true,
      changeStartMode: false,
      changeEndMode: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  } 

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).classList.add('node', 'node-visited');
        // document.getElementById(`node-${node.row}-${node.col}`).className =
        //   'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; ++i) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).classList.add('node', 'node-shortest-path');
        // document.getElementById(`node-${node.row}-${node.col}`).className='node node-shortest-path';
      }, 25 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  clearGrid() {
    // this.render();
    // return;
    for (let row = 0; row < 20; ++row) {
      for (let col = 0; col < 50; ++col) {
        document.getElementById(`node-${row}-${col}`).classList.remove('node-visited'); 
        document.getElementById(`node-${row}-${col}`).classList.remove('node-shortest-path'); 
      }
    }
    const newGrid = getInitialGrid()
    this.setState({grid: newGrid});
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <div className='pathfinder_container'>
        <div className='pathfinder-header'>
          <button onClick={() => this.visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
          </button>
          <button onClick={() => this.clearGrid()}>
            Clear Grid
          </button>
        </div>
      
        <div className='pathfinder_grid'>
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall, isVisited } = node;
                  return (
                    <Node key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isVisited={isVisited}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>)
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

function getInitialGrid() {
  const grid = [];
  for (let row = 0; row < 20; ++row) {
    const currRow = [];
    for (let col = 0; col < 50; ++col) {
      currRow.push(createNode(row, col));
    }
    grid.push(currRow);
  }
  return grid;
}

function createNode(row, col) {
  return {
    col,
    row,
    isStart: row === 6 && col === 5,
    isFinish: row === 10 && col === 45,
    distance: Infinity,
    isVisited: false,
    previousNode: null,
    isWall: false,
  }
}

function getNewGridWithWallToggled(grid, row, col) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  }
  newGrid[row][col] = newNode;
  return newGrid;
}
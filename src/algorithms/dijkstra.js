export function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    startNode.previousNode = null;
    // get all nodes from the grid as an array
    let unvisitedNodes = getAllNodes(grid);

    while (unvisitedNodes.length) {
        // sort all the unvisited nodes by distance (Ideally this would've been a min heap but for 100 elements it is ok)
        sortNodesByDistance(unvisitedNodes);
        let currentNode = unvisitedNodes.shift();
        if (currentNode.isWall) {
            continue;
        }
        if (currentNode.isVisited) {
            continue;
        }

        if (currentNode.distance === Infinity) {
            return visitedNodesInOrder;
        }
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode)

        if (currentNode === finishNode) return visitedNodesInOrder;
    
        updateUnvisitedNeighbors(currentNode, grid);
    }
    console.log("DONE");
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    console.log(nodes);
    return nodes;
}

export function getNodesInShortestPathOrder(finishNode) {
    let currNode = finishNode;
    const nodesInShortestPathOrder = [];
    while (currNode !== null) {
        console.log(currNode);
        nodesInShortestPathOrder.unshift(currNode);
        currNode = currNode.previousNode;
    }
    return nodesInShortestPathOrder;
}
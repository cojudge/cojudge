Given a `n * n` matrix `grid` of `0's` and `1's` return the root of the corresponding quad tree. (In Cojudge the tree is returned as a BFS serialization: a list of `[isLeaf, val]` pairs with `1/0` integers. Leaves have no children in the serialization; internal nodes are followed by their four children in order topLeft, topRight, bottomLeft, bottomRight.)

A Quad-Tree is a tree data structure in which each internal node has exactly four children. We use `isLeaf` and `val` to represent the node.

We can construct a Quad-Tree from a two-dimensional area using the following steps:
1. If the current grid has the same value (all `1's` or all `0's`) set `isLeaf` True and set `val` to the grid's value and set the four children to Null.
2. If the current grid has different values, set `isLeaf` False and set `val` to any value and divide the current grid into four sub-grids.
3. Recurse on each of the four sub-grids.

**Example 1:**
```
Input: grid = [[0,1],[1,0]]
Output: [[0,1],[1,0],[1,1],[1,1],[1,0]]
```

**Example 2:**
```
Input: grid = [[1,1],[1,1]]
Output: [[1,1]]
```

**Constraints:**
- `n == grid.length == grid[i].length`
- `n == 2^x` where `0 <= x <= 6`

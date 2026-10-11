You are handed a square binary matrix `grid` of size `n * n` containing only `0` and `1`. Build the quad tree that represents it and return its root. In this judge the tree is submitted as a breadth-first encoding: a list of `[isLeaf, val]` pairs written with integers `1`/`0`. Leaf entries carry no children in the encoding, while each internal entry is followed by its four children in the sequence topLeft, topRight, bottomLeft, bottomRight.

A quad tree is a tree in which every branch node owns exactly four children. Each node is described by `isLeaf` together with `val`.

Form the tree for a square region with this recursive rule:
1. When every cell of the region stores one shared value (entirely `1` or entirely `0`), emit a leaf holding that value, with all four children Null.
2. When the region mixes values, emit a branch node (its `val` may be either value) and split the region into its four equal quadrants.
3. Apply the same procedure to each of the four quadrants.

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

A squirrel must carry each nut back to its tree on a grid where movement costs the Manhattan distance. The tree stands at `tree`, the squirrel starts at `squirrel`, and the nuts lie at the positions in `nuts`. The grid size (`height` rows, `width` columns) only bounds the coordinates.

Carrying one nut home is a round trip from the tree, except the very first nut, which the squirrel fetches starting from its own position instead of the tree. So the total equals twice every tree-to-nut distance, adjusted once by picking the first nut that saves the most: the one minimizing `dist(squirrel, nut) - dist(tree, nut)`.

**Example 1:**
```
Input: height = 5, width = 7, tree = [2,2], squirrel = [4,4], nuts = [[3,0],[2,5]]
Output: 12
Explanation: Round trips cost 2*3 + 2*3 = 12; the best first pick saves 0, so the total stays 12.
```

**Example 2:**
```
Input: height = 1, width = 3, tree = [0,1], squirrel = [0,0], nuts = [[0,2]]
Output: 3
Explanation: Fetch from distance 2, then carry home over distance 1.
```

**Example 3:**
```
Input: height = 4, width = 4, tree = [0,0], squirrel = [3,3], nuts = [[1,1],[2,2]]
Output: 10
Explanation: Round trips cost 4 + 8 = 12, and fetching (2,2) first saves 2, leaving 10.
```

**Constraints:**
- `1 <= height, width <= 100`
- `1 <= nuts.length <= 3000`
- All positions lie inside the grid.

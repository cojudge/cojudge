You are handed a grid `heightMap` where each entry gives the elevation of that cell. After rain, water pools in dips surrounded by higher ground and drains off any path that reaches the outer border.

Compute the total volume of water that stays trapped once everything settles. Each cell holds water up to the lowest rim height reachable without crossing lower ground.

**Example 1:**
```
Input: heightMap = [[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]
Output: 4
Explanation: Interior low spots collect 4 units before spilling over the surrounding rim.
```

**Example 2:**
```
Input: heightMap = [[3,3,3,3,3],[3,2,2,2,3],[3,2,1,2,3],[3,2,2,2,3],[3,3,3,3,3]]
Output: 10
Explanation: The bowl with rim 3 and depths 2 and 1 holds 10 units in total.
```

**Example 3:**
```
Input: heightMap = [[1,1,1],[1,1,1]]
Output: 0
Explanation: Flat ground with no enclosed dip traps nothing.
```

**Constraints:**
- `m == heightMap.length`, `n == heightMap[i].length`
- `1 <= m, n <= 200`
- `0 <= heightMap[i][j] <= 2 * 10^4`

You are handed a grid `heightMap` where each entry gives the elevation of that cell. After rain, water pools in dips surrounded by higher ground and drains off any path that reaches the outer border.

Compute the total volume of water that stays trapped once everything settles. Each cell holds water up to the lowest rim height reachable without crossing lower ground.

**Constraints:**
- `m == heightMap.length`, `n == heightMap[i].length`
- `1 <= m, n <= 200`
- `0 <= heightMap[i][j] <= 2 * 10^4`

You are given a rectangular grid `heights` with `m` rows and `n` columns, where `heights[r][c]` records the elevation of that square. Rain falling on a square drains into one of the four orthogonal neighbors whenever the neighbor is at the same elevation or lower; by repeating such steps, water can travel across the grid.

Squares along the upper border and the left border drain toward the Pacific Ocean, while squares along the lower border and the right border drain toward the Atlantic Ocean. Collect every position from which descending routes lead to both oceans.

![Pacific Atlantic Water Flow](/api/problems/pacific-atlantic-water-flow/asset/example.png)

**Constraints:**

- m == heights.length
- n == heights[r].length
- 1 ≤ m, n ≤ 200
- 0 ≤ heights[r][c] ≤ 10^5

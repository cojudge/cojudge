You are given an `m x n` grid `img` of gray values.

Build a smoothed grid of the same size where each cell becomes the floor of the average of itself plus all valid neighbours (up to 8 surrounding cells plus itself). Cells on borders simply average fewer entries.

**Example 1:**
```
Input: img = [[1,1,1],[1,0,1],[1,1,1]]
Output: [[0,0,0],[0,0,0],[0,0,0]]
Explanation: Corners average 3 cells, edges 6 cells, center 9 cells; every floor is 0.
```

**Example 2:**
```
Input: img = [[100,200,100],[200,50,200],[100,200,100]]
Output: [[137,141,137],[141,150,141],[137,141,137]]
Explanation: Each average uses the valid part of the 3x3 window.
```

**Constraints:**
- `1 <= m, n <= 200`
- `0 <= img[i][j] <= 255`

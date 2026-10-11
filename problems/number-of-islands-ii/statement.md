An `m x n` grid starts as all water. Land cells are added one at a time in the order given
by `positions` (adding an already-land cell changes nothing). After each addition, report
how many islands exist; an island is a group of land cells linked through shared sides.

**Example 1:**
```
Input: m = 3, n = 3, positions = [[0,0],[0,1],[1,2],[2,1]]
Output: [1,1,2,3]
Explanation: The first two cells join; the last two each start new islands.
```

**Example 2:**
```
Input: m = 1, n = 1, positions = [[0,0]]
Output: [1]
Explanation: One cell makes one island.
```

**Example 3:**
```
Input: m = 2, n = 2, positions = [[0,0],[1,1],[0,1]]
Output: [1,2,1]
Explanation: The third cell bridges the two earlier islands into one.
```

**Constraints:**
- `1 <= m, n <= 1000`
- `1 <= positions.length <= 10^4`
- Each position lies inside the grid.

A hero crosses a grid from the top-left corner to the bottom-right corner, moving only right or down. Each cell holds an integer: a negative number drains health, a positive number restores it, and zero leaves it unchanged.

Health must never drop to zero or below; it must stay at least 1 after every step, including the starting cell. Find the smallest starting health that lets the hero reach the goal along some path.

**Example 1:**
```
Input: dungeon = [[-2,-3,3],[-5,-10,1],[10,30,-5]]
Output: 7
Explanation: One best path goes right, right, down, down. Starting with 7 keeps health above zero throughout.
```

**Example 2:**
```
Input: dungeon = [[0]]
Output: 1
Explanation: No damage occurs, so 1 health suffices.
```

**Example 3:**
```
Input: dungeon = [[-3]]
Output: 4
Explanation: Entering a cell with -3 from 4 health leaves 1.
```

**Constraints:**
- `1 <= m, n <= 100`
- `-1000 <= dungeon[i][j] <= 1000`

A hero crosses a grid from the top-left corner to the bottom-right corner, moving only right or down. Each cell holds an integer: a negative number drains health, a positive number restores it, and zero leaves it unchanged.

Health must never drop to zero or below; it must stay at least 1 after every step, including the starting cell. Find the smallest starting health that lets the hero reach the goal along some path.

**Constraints:**
- `1 <= m, n <= 100`
- `-1000 <= dungeon[i][j] <= 1000`

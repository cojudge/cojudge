A rectangular grid holds `0` for water and `1` for land. Cells touching up, down, left or right belong to the same island; diagonal contact does not join islands.

Two islands share a shape when one can be slid (without rotation or flipping) to cover the other exactly. Count how many different shapes appear.

This is a portable adaptation: the grid arrives as `int_array_2d` and the answer is the integer shape count.

**Example 1:**
```
Input: grid = [[1,1,0,0,0],[1,1,0,0,0],[0,0,0,1,1],[0,0,0,1,1]]
Output: 1
Explanation: Both islands are 2x2 blocks, so only one shape occurs.
```

**Example 2:**
```
Input: grid = [[1,1,0,1,1],[1,0,0,0,0],[0,0,0,0,1],[1,1,0,1,1]]
Output: 3
Explanation: Three translation classes appear among the four islands.
```

**Example 3:**
```
Input: grid = [[0,0,0],[0,0,0]]
Output: 0
Explanation: No land means no shapes.
```

**Constraints:**
- `1 <= grid.length, grid[0].length <= 50`
- Grid entries are `0` or `1`.

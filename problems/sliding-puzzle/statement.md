You are given a `2 x 3` board holding the tiles `1` through `5` plus one empty cell marked `0`. In a single move you may slide a tile that neighbors the empty cell horizontally or vertically into it (swapping `0` with an adjacent number).

The solved layout is `[[1,2,3],[4,5,0]]`. Starting from the given `board`, return the fewest moves that reach the solved layout, or `-1` when it cannot be reached.

**Example 1:**
```
Input: board = [[1,2,3],[4,0,5]]
Output: 1
Explanation: Slide 5 left into the empty cell.
```

**Example 2:**
```
Input: board = [[1,2,3],[5,4,0]]
Output: -1
Explanation: No sequence of slides reaches the solved order from this start.
```

**Example 3:**
```
Input: board = [[4,1,2],[5,0,3]]
Output: 5
Explanation: One shortest route needs five swaps of the empty cell.
```

**Constraints:**
- `board.length == 2`, `board[i].length == 3`
- `0 <= board[i][j] <= 5`
- Each value appears exactly once

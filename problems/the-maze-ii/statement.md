A ball rolls through a rectangular grid. Cells holding `0` are open floor and cells holding `1` are walls. From any open cell the ball can be launched in one of the four straight directions (up, down, left, right). Once moving it keeps rolling until a wall or the outer border stops it; it cannot halt partway. Each step onto a neighboring open cell adds one to the travelled length.

Given the grid `maze`, a `start` cell `[row, col]` and a `destination` cell `[row, col]`, compute the smallest total travel length that carries the ball from `start` to `destination` while obeying the rolling rule. The ball must come to rest exactly on `destination`. Return `-1` when the destination cannot be reached this way.

**Example 1:**
```
Input: maze = [[0,0,1,0,0],[0,0,0,0,0],[0,0,0,1,0],[1,1,0,1,1],[0,0,0,0,0]], start = [0,4], destination = [4,4]
Output: 12
Explanation: One shortest rolling route covers 12 steps before stopping on the target.
```

**Example 2:**
```
Input: maze = [[0,0,1,0,0],[0,0,0,0,0],[0,0,0,1,0],[1,1,0,1,1],[0,0,0,0,0]], start = [0,4], destination = [3,2]
Output: -1
Explanation: The ball can never come to rest on that cell, so the answer is -1.
```

**Example 3:**
```
Input: maze = [[0,0,0],[0,0,0],[0,0,0]], start = [0,0], destination = [2,2]
Output: 4
Explanation: Roll right across the top row (2 steps), then down the last column (2 steps).
```

**Constraints:**
- `1 <= maze.length, maze[0].length <= 100`
- `maze[i][j]` is `0` (open) or `1` (wall)
- `start.length == 2` and `destination.length == 2`
- `0 <= start[0], destination[0] < maze.length`
- `0 <= start[1], destination[1] < maze[0].length`
- Both `start` and `destination` are open cells

A robot starts at position `(0, 0)` facing north. It follows a list of integer `commands`:

- A value of `-2` turns it 90 degrees to the left without moving.
- A value of `-1` turns it 90 degrees to the right without moving.
- A value `k` between `1` and `9` moves it forward `k` steps, one cell at a time. If the next cell holds an obstacle, the robot stops that command early and stays where it is.

`obstacles` lists the blocked cells as `[x, y]` pairs. After running every command, return the largest Euclidean distance squared (`x*x + y*y`) the robot ever reached.

**Example 1:**
```
Input: commands = [4,-1,3], obstacles = []
Output: 25
Explanation: The robot walks to (0, 4), turns east, then walks to (3, 4), where 3*3 + 4*4 = 25.
```

**Example 2:**
```
Input: commands = [4,-1,4,-2,4], obstacles = [[2,4]]
Output: 65
Explanation: The robot reaches (0, 4), turns east but is stopped by the obstacle at (2, 4) and halts at (1, 4), then turns north and finishes at (1, 8), giving 1 + 64 = 65.
```

**Example 3:**
```
Input: commands = [6,-1,-1,6], obstacles = []
Output: 36
Explanation: The robot walks north to (0, 6), turns around, and walks back to the origin. The farthest point is (0, 6) with distance squared 36.
```

**Constraints:**
- `1 <= commands.length <= 10^4`
- Each command is `-2`, `-1`, or an integer from `1` to `9`.
- `0 <= obstacles.length <= 10^4`
- `-30000 <= obstacles[i][0], obstacles[i][1] <= 30000`
- The final answer fits in a 32-bit signed integer.

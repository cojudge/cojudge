A robot starts at position `(0, 0)` facing north. It follows a list of integer `commands`:

- A value of `-2` turns it 90 degrees to the left without moving.
- A value of `-1` turns it 90 degrees to the right without moving.
- A value `k` between `1` and `9` moves it forward `k` steps, one cell at a time. If the next cell holds an obstacle, the robot stops that command early and stays where it is.

`obstacles` lists the blocked cells as `[x, y]` pairs. After running every command, return the largest Euclidean distance squared (`x*x + y*y`) the robot ever reached.

**Constraints:**
- `1 <= commands.length <= 10^4`
- Each command is `-2`, `-1`, or an integer from `1` to `9`.
- `0 <= obstacles.length <= 10^4`
- `-30000 <= obstacles[i][0], obstacles[i][1] <= 30000`
- The final answer fits in a 32-bit signed integer.

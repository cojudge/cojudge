A ball rolls on a grid where `0` means open and `1` means wall. From a resting spot it may roll up (`u`), down (`d`), left (`l`) or right (`r`). It slides straight until the next step would hit a wall or leave the grid. There is one exception: if the rolling path crosses the hole cell, the ball drops in immediately and stops, even in open space.

Starting from `ball`, find the shortest rolling route that ends in the hole. Distance is the number of open cells traveled. If several shortest routes exist, return the lexicographically smallest direction string (`d` < `l` < `r` < `u` in character order). When the hole cannot be reached, return the word `impossible`.

**Example 1:**
```
Input: maze = [[0,0,0,0,0],[1,1,0,0,1],[0,0,0,0,0],[0,1,0,0,1],[0,1,0,0,0]], ball = [4,3], hole = [0,1]
Output: "lul"
Explanation: Rolling left, up and left in three segments reaches the hole with minimal distance.
```

**Example 2:**
```
Input: maze = [[0,0,0,0,0],[1,1,0,0,1],[0,0,0,0,0],[0,1,0,0,1],[0,1,0,0,0]], ball = [4,3], hole = [3,0]
Output: "impossible"
Explanation: The hole sits in a pocket no rolling path can stop in.
```

**Constraints:**
- `1 <= maze.length, maze[i].length <= 100`
- Entries are `0` or `1`; ball and hole lie on open cells
- Ball and hole positions differ

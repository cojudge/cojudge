A ball rolls on a grid where `0` means open and `1` means wall. From a resting spot it may roll up (`u`), down (`d`), left (`l`) or right (`r`). It slides straight until the next step would hit a wall or leave the grid. There is one exception: if the rolling path crosses the hole cell, the ball drops in immediately and stops, even in open space.

Starting from `ball`, find the shortest rolling route that ends in the hole. Distance is the number of open cells traveled. If several shortest routes exist, return the lexicographically smallest direction string (`d` < `l` < `r` < `u` in character order). When the hole cannot be reached, return the word `impossible`.

**Constraints:**
- `1 <= maze.length, maze[i].length <= 100`
- Entries are `0` or `1`; ball and hole lie on open cells
- Ball and hole positions differ

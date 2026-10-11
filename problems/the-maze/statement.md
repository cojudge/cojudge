A ball rests on an empty cell of a grid maze. Cells holding `0` are open; cells holding `1` are walls. From any stopping position the ball may roll in one of the four straight directions. Once moving it keeps sliding through open cells and only halts when the next step would hit a wall or leave the grid. At each halt it may pick a new direction.

Given the maze plus a start coordinate and a destination coordinate, decide whether the ball can come to rest exactly on the destination. Passing over the destination without stopping does not count.

Return `true` when such a rolling route exists and `false` otherwise.

**Constraints:**
- `1 <= maze.length, maze[i].length <= 100`
- Entries are `0` (open) or `1` (wall)
- Start and destination lie on open cells and differ
- At least two open cells exist

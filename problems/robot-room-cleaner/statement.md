A room is drawn as a grid of cells. A value of `1` marks a free cell the robot may enter, while `0` marks a wall or piece of furniture that blocks movement. The robot begins on a guaranteed free cell given by `row` and `col`, facing upward.

In the original interactive version the robot is blindfolded and may only use move, turn and clean operations. This offline adaptation hands you the whole layout at once: count how many distinct free cells are reachable from the start by moving up, down, left or right through free cells. That count equals the number of cells a perfect cleaning tour would visit.

Return that reachable free-cell count. A single isolated free cell therefore yields `1`.

**Example 1:**
```
Input: room = [[1,1,1,1,1,0,1,1],[1,1,1,1,1,0,1,1],[1,0,1,1,1,1,1,1],[0,0,0,1,0,0,0,0],[1,1,1,1,1,1,1,1]], row = 1, col = 3
Output: 33
Explanation: Thirty-three free cells connect to the start; walls split off the rest.
```

**Example 2:**
```
Input: room = [[1]], row = 0, col = 0
Output: 1
Explanation: Only the starting cell is free and reachable.
```

**Adaptation note:** The classic statement uses a `Robot` interface with `move`, `turnLeft`, `turnRight` and `clean`, and returns nothing. Here the signature is `cleanRoom(room, row, col)` returning an integer count, mirroring the rolling-ball style of the-maze problems so the judge can check it directly.

**Constraints:**
- `1 <= room.length <= 20`
- `1 <= room[i].length <= 20`
- Each entry is `0` or `1`
- `room[row][col] == 1`

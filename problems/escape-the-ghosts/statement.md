You begin at the origin `(0, 0)` of an endless grid and want to reach a
destination cell `target = [xt, yt]`. Several ghosts start from the cells
listed in `ghosts`, where each entry is `[xg, yg]`. Every turn, you and each
ghost may independently stay put or step one cell north, south, east, or
west, all moving at once.

You succeed exactly when you can step onto the destination strictly before
any ghost could get there (ghosts play optimally to intercept). If a ghost
can arrive at the same time as you or earlier — even by heading straight
for the target — the escape fails. Because the grid is open, only the
shortest-path distances matter, measured with Manhattan steps.

**Example 1:**
```
Input: ghosts = [[1,0],[0,3]], target = [0,1]
Output: true
Explanation: You need one step to reach the goal, while the nearest ghost
needs at least two, so you arrive first.
```

**Example 2:**
```
Input: ghosts = [[1,0]], target = [2,0]
Output: false
Explanation: The ghost starts between you and the goal and reaches it in
one step versus your two.
```

**Example 3:**
```
Input: ghosts = [[2,0]], target = [1,0]
Output: false
Explanation: Both you and the ghost need one step, and a tie counts as a
capture.
```

**Constraints:**
- `1 <= ghosts.length <= 100`
- `ghosts[i].length == 2`
- `-10^4 <= xg, yg <= 10^4`
- `-10^4 <= xt, yt <= 10^4`
- Several ghosts may share a cell.

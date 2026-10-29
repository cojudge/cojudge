You are given a nonempty rectangular matrix `rooms` containing three kinds of cells:

- `-1` is a wall.
- `0` is a gate.
- `2147483647` is an empty room.

For every empty room, fill it with the distance to its nearest gate using horizontal and vertical moves. Walls cannot be crossed. If no gate is reachable, leave the room as `2147483647`.

This version adapts the usual in-place operation: return the completed matrix.

**Constraints:**
- `1 <= rooms.length <= 250`
- `1 <= rooms[r].length <= 250`
- Every row has the same length.
- Every cell is `-1`, `0`, or `2147483647`.

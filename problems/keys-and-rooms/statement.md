Decide whether every room can be entered starting from room zero.

There are `n` rooms numbered `0` to `n-1`. The array `rooms[i]` lists the keys found inside room `i`: each key `k` unlocks room `k`. You begin in room 0 with it already open, collect its keys, and repeatedly open any room for which you hold a key. Return `true` when this process can reach all rooms, otherwise `false`.

**Constraints:**
- `1 <= rooms.length <= 1000`
- `0 <= rooms[i].length <= 1000`
- `0 <= rooms[i][j] < rooms.length`

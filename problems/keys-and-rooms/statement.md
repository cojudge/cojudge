Decide whether every room can be entered starting from room zero.

There are `n` rooms numbered `0` to `n-1`. The array `rooms[i]` lists the keys found inside room `i`: each key `k` unlocks room `k`. You begin in room 0 with it already open, collect its keys, and repeatedly open any room for which you hold a key. Return `true` when this process can reach all rooms, otherwise `false`.

**Example 1:**
```
Input: rooms = [[1],[2],[3],[]]
Output: true
Explanation: Visit 0, unlock 1, then 2, then 3 in a chain.
```

**Example 2:**
```
Input: rooms = [[1,3],[3,0,1],[2],[0]]
Output: false
Explanation: Rooms 0, 1 and 3 connect, but room 2 is never unlocked.
```

**Example 3:**
```
Input: rooms = [[]]
Output: true
Explanation: A single room is already visited.
```

**Constraints:**
- `1 <= rooms.length <= 1000`
- `0 <= rooms[i].length <= 1000`
- `0 <= rooms[i][j] < rooms.length`

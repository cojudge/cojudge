A frog sits on stones placed at distinct positions along a river, starting at position `0`. The positions are given in strictly increasing order in `stones`, and the frog wants to finish on the final stone.

The opening hop must cover exactly `1` unit. Suppose the previous hop covered `k` units; the next hop may cover `k - 1`, `k`, or `k + 1` units, and it must land on a stone ahead (jumps are always forward, and a hop of length zero or less is never allowed).

Decide whether the last stone is reachable under these rules.

**Example 1:**
```
Input: stones = [0,1,3,5,6,8,12,17]
Output: true
Explanation: One workable chain uses hop sizes 1, 2, 2, 3, 4 and 5 to walk from the first stone to the last.
```

**Example 2:**
```
Input: stones = [0,1,2,3,4,8,9,11]
Output: false
Explanation: After stone 4 the next stone is too far away for any reachable hop size, so the crossing fails.
```

**Example 3:**
```
Input: stones = [0,1]
Output: true
Explanation: A single hop of length 1 lands directly on the last stone.
```

**Constraints:**
- `2 <= stones.length <= 2000`
- `0 <= stones[i] <= 2^31 - 1`
- `stones[0] == 0`
- Positions are strictly increasing.

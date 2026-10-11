There are `n` slots numbered `1..n`, all starting unlit. Array `bulbs` is a permutation: `bulbs[d-1]` is the slot that lights up on day `d`.

A moment is good when there exist two lit slots with exactly `k` unlit slots between them (so their positions differ by `k+1`). Return the earliest day on which a good moment exists, or `-1` when it never happens.

**Example 1:**
```
Input: bulbs = [1,3,2], k = 1
Output: 2
```

**Example 2:**
```
Input: bulbs = [1,2,3], k = 1
Output: -1
```

**Example 3:**
```
Input: bulbs = [6,5,8,9,7,1,10,2,3,4], k = 2
Output: 8
```

**Constraints:**
- `1 <= bulbs.length <= 20000`
- `bulbs` is a permutation of `1..n`.
- `0 <= k < bulbs.length`

A binary matrix with `m` rows and `n` columns starts filled with zeros. Flipping picks a uniformly random cell holding 0, sets it to 1, and reports its coordinates; resetting restores all zeros.

**Adaptation used here.** Randomness cannot be graded by exact comparison, so this version asks for a batch directly: given `m`, `n` and `count`, return `count` distinct valid cell positions `[row, col]` as they would come out of successive flips. The grader accepts any set that is the right size, lies inside the board, and contains no duplicates. When `count` exceeds the board capacity `m * n`, return every cell exactly once (any order).

Given `m`, `n` and `count`, return the list of positions.

**Example 1:**
```
Input: m = 3, n = 1, count = 2
Output: [[1,0],[2,0]]
Explanation: Any two of the three cells form a valid answer; one possibility is rows 1 and 2.
```

**Example 2:**
```
Input: m = 2, n = 2, count = 4
Output: [[0,0],[0,1],[1,0],[1,1]]
Explanation: Asking for the whole board must return each of the four cells once, in any order.
```

**Example 3:**
```
Input: m = 1, n = 1, count = 0
Output: []
Explanation: Zero flips produce an empty list.
```

**Constraints:**
- `1 <= m, n <= 100`
- `0 <= count <= m * n`

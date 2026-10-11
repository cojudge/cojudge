You are given an `n x n` binary grid containing exactly two islands (groups of `1`s connected up-down-left-right). Flipping a `0` to `1` extends land.

Return the smallest number of water cells that must be flipped so the two islands become one connected group.

**Example 1:**
```
Input: grid = [[0,1],[1,0]]
Output: 1
Explanation: One diagonal gap needs a single flip to join.
```

**Example 2:**
```
Input: grid = [[0,1,0],[0,0,0],[0,0,1]]
Output: 2
Explanation: The Manhattan gap minus one is two.
```

**Example 3:**
```
Input: grid = [[1,1,1,1,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,1,1,1,1]]
Output: 1
Explanation: The inner single cell is one step from the outer ring.
```

**Constraints:**
- `2 <= n <= 100`
- The grid holds exactly two 4-directionally connected islands of `1`s.

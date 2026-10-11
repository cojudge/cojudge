You are given distinct points `points` on a plane, each written as `[x, y]`. A boomerang is an ordered triple `(i, j, k)` of different indices where point `i` sits equally far from `j` and `k`. The order of the two outer points matters, so `(i,j,k)` and `(i,k,j)` count as two boomerangs when both qualify.

Return the total number of boomerangs.

Distances are compared by squared length, so no square roots are needed.

**Example 1:**
```
Input: points = [[0,0],[1,0],[2,0]]
Output: 2
Explanation: With middle 1, both orderings of the outer points 0 and 2 qualify.
```

**Example 2:**
```
Input: points = [[1,1],[2,2],[3,3]]
Output: 2
Explanation: Only the middle point 2 sees equal distances to the other two.
```

**Example 3:**
```
Input: points = [[1,1]]
Output: 0
Explanation: Three different indices are required.
```

**Constraints:**
- `1 <= points.length <= 500`
- Each point is `[x, y]` with `-10^4 <= x, y <= 10^4`.
- All points are distinct.

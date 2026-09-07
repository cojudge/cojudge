You are given a positive integer `k`. You are also given:
- a 2D integer array `rowConditions` of size `n` where `rowConditions[i] = [abovei, belowi]`, and
- a 2D integer array `colConditions` of size `m` where `colConditions[i] = [lefti, righti]`.

The two arrays contain integers from `1` to `k`.

You have to build a `k x k` matrix that contains each of the numbers from `1` to `k` exactly once. The remaining cells should have the value `0`.

The matrix should also satisfy the following conditions:
- The number `abovei` should appear in a row that is strictly above the row at which the number `belowi` appears for all `i` from `0` to `n - 1`.
- The number `lefti` should appear in a column that is strictly left of the column at which the number `righti` appears for all `i` from `0` to `m - 1`.

Return any matrix that satisfies the conditions. If no answer exists, return an empty matrix.

**Example 1:**
```
Input: k = 3, rowConditions = [[1,2],[3,2]], colConditions = [[2,1],[3,2]]
Output: [[3,0,0],[0,0,1],[0,2,0]]
```

**Example 2:**
```
Input: k = 3, rowConditions = [[1,2],[2,3],[3,1],[2,3]], colConditions = [[2,1]]
Output: []
```

**Constraints:**
- `2 <= k <= 400`
- `1 <= rowConditions.length, colConditions.length <= 10^4`
- `rowConditions[i].length == colConditions[i].length == 2`
- `1 <= abovei, belowi, lefti, righti <= k`
- `abovei != belowi`
- `lefti != righti`

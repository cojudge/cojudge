You are given `n` pairs `[a, b]` with `a < b`. A chain links pairs so that each pair's second entry is strictly smaller than the next pair's first entry (`b < c` for `[a,b]` followed by `[c,d]`). Pairs may be reordered freely and any subset may be used.

Implement `findLongestChain(pairs)` returning the longest achievable chain length.

**Example 1:**
```
Input: pairs = [[1,2],[2,3],[3,4]]
Output: 2
Explanation: [1,2] then [3,4] is valid, but [1,2] then [2,3] is not since 2 is not less than 2.
```

**Example 2:**
```
Input: pairs = [[1,2],[7,8],[4,5]]
Output: 3
Explanation: Ordering as [1,2], [4,5], [7,8] chains all three.
```

**Example 3:**
```
Input: pairs = [[1,2]]
Output: 1
```

**Constraints:**
- `1 <= pairs.length <= 2500`
- `pairs[i].length == 2`
- `-1000 <= pairs[i][j] <= 1000`

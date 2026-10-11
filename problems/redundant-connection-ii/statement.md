You are given directed edges that start from a rooted tree (each node except the root has exactly one parent, the root has none) plus one extra directed edge.

Return the extra edge whose removal restores a rooted tree. When several candidates work, return the one appearing last in the input.

**Example 1:**
```
Input: edges = [[1,2],[1,3],[2,3]]
Output: [2,3]
```

**Example 2:**
```
Input: edges = [[1,2],[2,3],[3,4],[4,1],[1,5]]
Output: [4,1]
```

**Example 3:**
```
Input: edges = [[2,1],[3,1],[4,2],[1,4]]
Output: [2,1]
```

**Constraints:**
- The graph has `n` nodes labeled `1..n` and `n` edges.
- Edge endpoints lie in `[1, n]`.

You are given the root of a binary search tree plus two bounds `low` and `high`.

Walk the tree and drop every node whose value lies outside the closed interval `[low, high]`. Keep the search-tree ordering among the survivors and return the root of the trimmed tree. An empty result is represented by an empty tree.

**Example 1:**
```
Input: root = [1,0,2], low = 1, high = 2
Output: [1,null,2]
Explanation: Node 0 is below the interval and is removed.
```

**Example 2:**
```
Input: root = [3,0,4,null,2,null,null,1], low = 1, high = 3
Output: [3,2,null,1]
Explanation: Only values between 1 and 3 inclusive remain, still linked as a search tree.
```

**Example 3:**
```
Input: root = [], low = 1, high = 2
Output: []
```

**Constraints:**
- The tree holds between 0 and 10000 nodes.
- Node values and `low`/`high` fit in 32-bit signed integers, with `low <= high`.

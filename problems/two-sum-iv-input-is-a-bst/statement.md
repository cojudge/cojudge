You are given the root of a binary search tree and an integer `k`.

Decide whether the tree contains two different nodes whose values add up to `k`.

**Example 1:**
```
Input: root = [5,3,6,2,4,null,7], k = 9
Output: true
Explanation: The nodes holding 2 and 7 sum to 9.
```

**Example 2:**
```
Input: root = [5,3,6,2,4,null,7], k = 28
Output: false
Explanation: No two distinct nodes reach 28.
```

**Example 3:**
```
Input: root = [2,1,3], k = 4
Output: true
Explanation: The nodes holding 1 and 3 sum to 4.
```

**Constraints:**
- `1 <= number of nodes <= 10^4`
- `-10^4 <= node value <= 10^4`
- The tree satisfies binary-search-tree ordering.
- `-10^5 <= k <= 10^5`

You are given the root of a binary tree.

Decide whether cutting exactly one edge can divide the tree into two trees with equal sums.

**Example 1:**
```
Input: root = [5,10,10,null,null,2,3]
Output: true
Explanation: Total 30; the right branch sums to 15 and the rest sums to 15.
```

**Example 2:**
```
Input: root = [1,2,10,null,null,2,20]
Output: false
Explanation: Total 35 cannot be halved into integers by one cut.
```

**Constraints:**
- `1 <= number of nodes <= 10^4`
- `-1000 <= node value <= 1000`

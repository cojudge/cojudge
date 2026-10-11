You are given the root of a complete binary tree: every level except possibly the last is fully filled, and the last level's nodes sit as far left as possible. Count the nodes in the tree.

The tree is supplied in level-order form such as `[1,2,3,4,5,6]`, where `null` marks a missing child, and an empty list means there is no tree.

**Example 1:**
```
Input: root = [1,2,3,4,5,6]
Output: 6
Explanation: The tree holds six nodes.
```

**Example 2:**
```
Input: root = []
Output: 0
Explanation: There is no tree.
```

**Example 3:**
```
Input: root = [1]
Output: 1
Explanation: Only the root exists.
```

**Constraints:**
- The tree holds between 0 and `5 * 10^4` nodes.
- `0 <= node value <= 10^5`

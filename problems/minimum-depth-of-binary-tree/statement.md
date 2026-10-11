Find how short the shortest root-to-leaf chain in a binary tree can be.

A leaf is a node with neither a left nor a right child. Count nodes along the path, so a lone root has depth 1 and an empty tree has depth 0. Where a node has only one child, the path must continue through that child — a missing side does not count as depth 0.

**Example 1:**
```
Input: root = [3,9,20,null,null,15,7]
Output: 2
Explanation: Path 3 -> 9 reaches a leaf in 2 steps, shorter than 3 -> 20 -> 15.
```

**Example 2:**
```
Input: root = [2,null,3,null,4,null,5,null,6]
Output: 5
Explanation: The single chain 2 -> 3 -> 4 -> 5 -> 6 has length 5.
```

**Example 3:**
```
Input: root = []
Output: 0
```

**Constraints:**
- `0 <= number of nodes <= 10^5`
- `-1000 <= Node.val <= 1000`

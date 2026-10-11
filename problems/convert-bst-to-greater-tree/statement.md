You are given the root of a binary search tree (BST). Rewrite the tree so that every node's value becomes the sum of its original value plus all values greater than it (keeping the same shape). In other words, each node accumulates the total of its own key and every larger key in the tree.

Return the root of the rewritten tree.

**Example 1:**
```
Input: root = [4,1,6,0,2,5,7,null,null,null,3,null,null,null,8]
Output: [30,36,21,36,35,26,15,null,null,null,33,null,null,null,8]
Explanation: Visiting keys from largest to smallest keeps a running total: 8 stays 8, 7 becomes 15, 6 becomes 21, 5 becomes 26, 4 becomes 30, 3 becomes 33, 2 becomes 35, 1 becomes 36, and 0 becomes 36.
```

**Example 2:**
```
Input: root = [0,null,1]
Output: [1,null,1]
Explanation: The node 1 keeps 1; the node 0 absorbs it and becomes 1.
```

**Example 3:**
```
Input: root = [1,0,2]
Output: [3,3,2]
Explanation: Node 2 keeps 2, node 1 becomes 1+2 = 3, node 0 becomes 0+1+2 = 3.
```

**Constraints:**
- The tree holds between 0 and 10^4 nodes.
- `-10^4 <= Node.val <= 10^4`
- The tree is a valid BST with distinct values.
- The rewritten values fit in a 32-bit signed integer.

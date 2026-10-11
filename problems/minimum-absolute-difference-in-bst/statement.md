You are given the root of a binary search tree (BST): for every node, all values in its left subtree are smaller and all values in its right subtree are larger. Return the smallest absolute difference between the values of any two nodes in the tree.

**Example 1:**
```
Input: root = [4,2,6,1,3]
Output: 1
Explanation: The pair (2,3) differs by 1, and no pair is closer.
```

**Example 2:**
```
Input: root = [1,0,48,null,null,12,49]
Output: 1
Explanation: The pair (48,49) differs by 1, the minimum over all pairs.
```

**Example 3:**
```
Input: root = [1,null,2]
Output: 1
Explanation: The only pair (1,2) differs by 1.
```

**Constraints:**
- The tree holds between 2 and 10^4 nodes.
- `0 <= Node.val <= 10^5`
- The tree is a valid BST with distinct values.

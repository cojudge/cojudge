Reshape a binary tree into a right-leaning chain that follows preorder visiting order.

After flattening, every node's left pointer must be empty and each right pointer must lead to the next node in a preorder walk (root, then left subtree, then right subtree). The node values stay the same; only the links change.

Return the root of the reshaped tree.

**Example 1:**
```
Input: root = [1,2,5,3,4,null,6]
Output: [1,null,2,null,3,null,4,null,5,null,6]
Explanation: Preorder gives 1,2,3,4,5,6, chained through right pointers.
```

**Example 2:**
```
Input: root = []
Output: []
```

**Example 3:**
```
Input: root = [0]
Output: [0]
```

**Constraints:**
- `0 <= number of nodes <= 2000`
- `-100 <= Node.val <= 100`

**Adaptation note:** The classic task rewrites the tree in place and returns nothing. This version returns the flattened root so the result can be serialized and graded.

You are given the root of a binary search tree and an integer `val`. In such a tree, every left descendant is smaller than its ancestor and every right descendant is larger.

Locate the node whose value equals `val` and return the whole subtree starting there (encoded in level order). If no node holds `val`, return an empty tree `[]`.

**Example 1:**
```
Input: root = [4,2,7,1,3], val = 2
Output: [2,1,3]
Explanation: The node 2 roots the subtree holding 2, 1 and 3.
```

**Example 2:**
```
Input: root = [4,2,7,1,3], val = 5
Output: []
Explanation: No node holds 5.
```

**Example 3:**
```
Input: root = [1,null,2,null,3], val = 3
Output: [3]
Explanation: The deepest node alone forms the answer.
```

**Constraints:**
- Node count lies in `[1, 5000]`.
- `1 <= Node.val, val <= 10^7`
- The input is a valid search tree.

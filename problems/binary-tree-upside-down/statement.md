You are given the root of a binary tree in which every node either has no right child or its right child is a leaf, and every left child (when present) is an internal node with its own children. Turn the whole tree upside down and return the new root.

Rewiring follows one rule applied bottom-up along the left spine: for each node `p` with left child `l` and right child `r`, after the flip `l` takes `p`'s position, with `l.left = r` and `l.right = p`. The original root becomes a leaf.

**Example 1:**
```
Input: root = [1,2,3,4,5]
Output: [4,5,2,null,null,3,1]
Explanation: The leftmost leaf 4 becomes the new root; 5 becomes its left child and 2 (with its right subtree 3 and parent 1) becomes its right child.
```

**Example 2:**
```
Input: root = []
Output: []
Explanation: An empty tree stays empty.
```

**Example 3:**
```
Input: root = [1]
Output: [1]
Explanation: A single node is already upside down.
```

**Constraints:**
- The tree holds between 0 and 1000 nodes.
- `0 <= Node.val <= 100`
- The input always satisfies the structural rule above (right children are leaves or absent).

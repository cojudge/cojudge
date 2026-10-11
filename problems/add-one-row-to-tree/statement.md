You are given a binary tree root, an integer `val`, and a 1-based target `depth`. Insert a full row of new nodes holding `val` at that depth.

- When `depth` is 1, create a fresh root with value `val`; the previous tree becomes its left subtree.
- Otherwise, every node currently at depth `depth-1` receives two fresh children both holding `val`. The node's former left subtree is reattached as the left child of the new left node, and its former right subtree as the right child of the new right node. Nodes already deeper simply shift one level down.

Return the (possibly new) root.

**Example 1:**
```
Input: root = [4,2,6,3,1,5], val = 1, depth = 2
Output: [4,1,1,2,null,null,6,3,1,5,null]
```

**Example 2:**
```
Input: root = [4,2,null,3,1], val = 1, depth = 3
Output: [4,2,null,1,1,3,null,null,1]
```

**Example 3:**
```
Input: root = [1], val = 5, depth = 1
Output: [5,1]
```

**Constraints:**
- Tree size is between 0 and 10000 nodes.
- Depth is at least 1 and at most one past the current height plus one.
- Values fit in 32-bit signed integers.

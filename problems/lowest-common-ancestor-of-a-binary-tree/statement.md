Given the root of a binary tree and two distinct values `p` and `q` that both occur in the tree, find their lowest common ancestor.

The lowest common ancestor of two nodes is the deepest node that has both of them in its subtree, where a node counts as being in its own subtree. All node values in the tree are unique.

Return the ancestor node itself (as a tree).

*Adaptation note:* the original statement passes the two target nodes as node references. Here they are passed as integer values `p` and `q` instead, since every value is unique; the returned tree is the subtree rooted at the ancestor.

**Example 1:**
```
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
Output: [3,5,1,6,2,0,8,null,null,7,4]
Explanation: Nodes 5 and 1 sit in opposite subtrees of 3, so the ancestor is 3.
```

**Example 2:**
```
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
Output: [5,6,2,null,null,7,4]
Explanation: Node 4 is inside the subtree of 5, so the ancestor is 5 itself.
```

**Example 3:**
```
Input: root = [1,2], p = 1, q = 2
Output: [1,2]
Explanation: Node 2 is a direct child of 1, so the ancestor is 1.
```

**Constraints:**
- The number of nodes is in the range `[2, 10^5]`.
- `-10^9 <= Node.val <= 10^9`
- All node values are unique.
- `p != q`, and both values exist in the tree.

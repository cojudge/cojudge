Take the `root` of a binary tree and list its node values in postorder sequence: for every subtree, first enumerate its entire left branch, then its entire right branch, and only afterwards record the subtree's own root value.

**Example 1:**
```
Input: root = [1,null,2,3]
Output: [3,2,1]
```
The left-deep node `3` is emitted first, then its parent `2`, and the overall root `1` comes last.

**Example 2:**
```
Input: root = []
Output: []
```
With no nodes, the listing is empty.

**Example 3:**
```
Input: root = [1]
Output: [1]
```
A lone root yields just its own value.

**Constraints:**
- The number of nodes in the tree is in the range `[0, 100]`
- `-100 <= Node.val <= 100`

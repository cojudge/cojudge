Rebuild a binary tree when you are given its inorder and postorder visit orders.

The inorder walk lists each subtree as left, root, right. The postorder walk lists each subtree as left, right, root — so the last postorder entry is the overall root. Find that root value inside the inorder list: entries to its left belong to the left subtree and entries to its right belong to the right subtree. Apply the same reasoning recursively to each side.

All values are unique, and both lists describe the same tree. Return its root.

**Example 1:**
```
Input: inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
Output: [3,9,20,null,null,15,7]
Explanation: Postorder ends with 3, the root. In inorder, 3 separates [9] (left) from [15,20,7] (right). Recursing restores the full tree.
```

**Example 2:**
```
Input: inorder = [-1], postorder = [-1]
Output: [-1]
```

**Constraints:**
- `1 <= inorder.length <= 3000`
- `postorder.length == inorder.length`
- `-3000 <= inorder[i], postorder[i] <= 3000`
- Both lists contain distinct values, and every postorder value appears in inorder.

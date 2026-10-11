You are given two arrays, `preorder` and `postorder`, holding the preorder and postorder traversals of one binary tree whose values are all distinct. Rebuild the tree and return its root.

When several different trees fit the two traversals, any one of them is accepted.

**Example 1:**
```
Input: preorder = [1,2,4,5,3,6,7], postorder = [4,5,2,6,7,3,1]
Output: [1,2,3,4,5,6,7]
Explanation: The root is 1. Its left child 2 parents 4 and 5, and its right child 3 parents 6 and 7.
```

**Example 2:**
```
Input: preorder = [1], postorder = [1]
Output: [1]
Explanation: A single node forms the whole tree.
```

**Example 3:**
```
Input: preorder = [1,2,3], postorder = [2,3,1]
Output: [1,2,3]
Explanation: Both children hang directly under the root 1.
```

**Constraints:**
- `1 <= preorder.length <= 30`
- `1 <= preorder[i], postorder[i] <= 30`
- All values in each array are distinct.
- `preorder` and `postorder` describe the same binary tree.

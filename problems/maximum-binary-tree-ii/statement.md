A maximum binary tree is built from an array by a simple rule: the largest
value becomes the root, the same rule applied to the part left of it builds
the left subtree, and the same rule applied to the part right of it builds the
right subtree.

You are given the `root` of such a tree (constructed from some array `a`) and
a new integer `val` that is appended to `a`. Rebuild the tree for the extended
array, returning its new root. The original tree must be reused rather than
reconstructed from scratch: the change only affects nodes along one path.

**Example 1:**
```
Input: root = [4,1,3,null,null,2], val = 5
Output: [5,4,null,1,3,null,null,2]
Explanation: 5 exceeds every existing value, so it becomes the new root with the old tree on its left.
```

**Example 2:**
```
Input: root = [5,2,4,null,1], val = 3
Output: [5,2,4,null,1,null,3]
Explanation: 3 settles as the right child of 4.
```

**Example 3:**
```
Input: root = [5,2,3,null,1], val = 4
Output: [5,2,4,null,1,3]
Explanation: 4 takes the place of 3, which slides down to become its left child.
```

**Constraints:**
- The number of nodes is between `1` and `100`.
- `1 <= Node.val <= 100`
- All node values are distinct.
- `1 <= val <= 100`

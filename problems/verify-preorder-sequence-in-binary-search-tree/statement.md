Given an array `preorder` of distinct integers, decide whether it could be the preorder walk of some binary search tree. In a preorder walk the root comes first, then the whole left subtree, then the whole right subtree, and every left descendant is smaller than its ancestor while every right descendant is larger.

Return `true` when such a tree exists and `false` otherwise.

**Example 1:**
```
Input: preorder = [5,2,1,3,6]
Output: true
Explanation: A tree with root 5, left child 2 (children 1 and 3) and right child 6 produces exactly this order.
```

**Example 2:**
```
Input: preorder = [5,2,6,1,3]
Output: false
Explanation: Once 6 appears in the right subtree of 5, the later value 1 cannot go back to the left side, so no binary search tree matches.
```

**Example 3:**
```
Input: preorder = [1]
Output: true
Explanation: A single node always forms a valid walk.
```

**Constraints:**
- `1 <= preorder.length <= 10^4`
- `-10^4 <= preorder[i] <= 10^4`
- All values in `preorder` are distinct.

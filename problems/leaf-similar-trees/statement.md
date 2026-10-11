You are given the roots of two binary trees, `root1` and `root2`, each in level-order form.

For a tree, write down the values of its leaves (nodes with no children) in left-to-right order. This list is the leaf sequence.

Return `true` when the two trees share exactly the same leaf sequence, and `false` otherwise. Empty trees have an empty sequence.

**Example 1:**
```
Input: root1 = [3,5,1,6,2,9,8,null,null,7,4], root2 = [3,5,1,6,7,4,2,null,null,null,null,null,null,9,8]
Output: true
Explanation: Both leaf orders are 6, 7, 4, 9, 8.
```

**Example 2:**
```
Input: root1 = [1,2,3], root2 = [1,3,2]
Output: false
Explanation: The orders are 2, 3 versus 3, 2.
```

**Example 3:**
```
Input: root1 = [1], root2 = [1]
Output: true
Explanation: Both sequences are a single 1.
```

**Constraints:**
- Each tree holds `1 <= n <= 200` nodes in these tests (empty `[]` also handled as edge).
- `0 <= node.val <= 200`

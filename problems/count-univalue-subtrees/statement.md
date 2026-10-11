Given the root of a binary tree, count the subtrees in which every node holds the same value. A single node (including each leaf) qualifies, and an empty tree contributes zero.

A subtree rooted at some node is univalue when that node's value matches the values of its left and right subtrees and both of those subtrees are themselves univalue. Empty children count as univalue.

Return the total number of such subtrees.

**Example 1:**
```
Input: root = [5,1,5,5,5,null,5]
Output: 4
Explanation: The univalue subtrees are the leaves 5, 5, 5 and the single node 1.
```

**Example 2:**
```
Input: root = []
Output: 0
Explanation: An empty tree has no subtrees.
```

**Example 3:**
```
Input: root = [5,5,5,5,5,null,5]
Output: 4
Explanation: Four single nodes plus larger matching groups combine into 4 univalue subtrees.
```

**Constraints:**
- The number of nodes is in the range `[0, 1000]`.
- `-1000 <= Node.val <= 1000`

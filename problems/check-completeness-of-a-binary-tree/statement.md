A binary tree is complete when every level except possibly the last is entirely filled, and all nodes of the last level sit as far left as possible. Equivalently, a level-order walk never meets a present node after the first missing slot.

Given the level-order serialization `root` of a binary tree, decide whether the tree is complete.

**Example 1:**
```
Input: root = [1,2,3,4,5,6]
Output: true
Explanation: Every level is full, so the tree satisfies the completeness rule.
```

**Example 2:**
```
Input: root = [1,2,3,4,5,null,7]
Output: false
Explanation: Node 3 is missing its left child yet has a right child 7, which breaks left-alignment.
```

**Example 3:**
```
Input: root = [1,null,2]
Output: false
Explanation: The root lacks a left child while holding a right child, so the tree is incomplete.
```

**Constraints:**
- The tree holds between 0 and 100 nodes.
- Node values are integers fitting in a 32-bit signed range.

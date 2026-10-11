You are given the root of a binary tree in level-order form. Among all nodes, look at those sitting at the greatest depth (the longest root-to-leaf distance).

Find the smallest subtree that holds every such deepest node. Return the root of that subtree, again encoded in level-order form.

Intuitively, walk down until the branches holding the deepest leaves finally meet; that meeting point is the answer.

**Example 1:**
```
Input: root = [3,5,1,6,2,0,8,null,null,7,4]
Output: [2,7,4]
Explanation: The deepest leaves are 7 and 4, and the smallest subtree holding both is rooted at 2.
```

**Example 2:**
```
Input: root = [1]
Output: [1]
Explanation: The only node is both deepest and the answer.
```

**Example 3:**
```
Input: root = [0,1,3,null,2]
Output: [2]
Explanation: Node 2 is the single deepest leaf, so the answer is itself.
```

**Constraints:**
- The tree holds `1 <= n <= 500` nodes.
- `0 <= node.val <= 500`
- All values are unique.

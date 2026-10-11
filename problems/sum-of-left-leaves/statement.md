You receive the root of a binary tree. Add up the values of certain special nodes: those that are leaves and sit as the left child of their parent.

A leaf means a node with neither a left nor a right child. The root itself never counts, because it has no parent. Any leaf reached via a right edge is ignored.

Return the total of all qualifying left-leaf values.

**Example 1:**
```
Input: root = [3,9,20,null,null,15,7]
Output: 24
Explanation: Node 9 is a left leaf, and node 15 is a left leaf inside the right subtree. Their sum is 9 + 15 = 24.
```

**Example 2:**
```
Input: root = [1]
Output: 0
Explanation: The lone node is not a child of anything, so the total is 0.
```

**Example 3:**
```
Input: root = [1,2,3,4,5]
Output: 4
Explanation: Node 4 is the only leaf attached as a left child.
```

**Constraints:**
- `1 <= number of nodes <= 1000`
- `-1000 <= Node.val <= 1000`

Given the root of a binary tree, compute its total tilt. The tilt of a single node is the absolute difference between the sum of all values in its left subtree and the sum of all values in its right subtree. The tilt of the whole tree is the sum of every node's tilt.

Empty subtrees contribute 0 to the sums. A leaf therefore always has tilt 0, while its value still counts toward its ancestors' sums.

**Example 1:**
```
Input: root = [1,2,3]
Output: 1
Explanation: Node 2 and node 3 are leaves (tilt 0); the root's tilt is |2 - 3| = 1.
```

**Example 2:**
```
Input: root = [4,2,9,3,5,null,7]
Output: 15
Explanation: Tilts are 2 at node 2, 7 at node 9, and 6 at the root, totaling 15.
```

**Example 3:**
```
Input: root = []
Output: 0
Explanation: An empty tree has no nodes and tilt 0.
```

**Constraints:**
- The node count is in `[0, 10^4]`.
- `-1000 <= Node.val <= 1000`

Given the root of a binary tree, find the longest route in which every visited node carries the same value. The route may go through a node and extend into both its left and right sides, or it may lie entirely inside one subtree; it does not have to include the root.

Count the route by edges (the number of links between nodes), not by nodes. A single node alone therefore scores `0`, and an empty tree also scores `0`.

**Example 1:**
```
Input: root = [5,4,5,1,1,null,5]
Output: 2
Explanation: The three nodes holding 5 (root, its right child, and the right grandchild) connect into a chain of two edges.
```

**Example 2:**
```
Input: root = [1,4,5,4,4,null,5]
Output: 2
Explanation: The left part holds a 4 with two 4 children, giving two edges of equal values.
```

**Example 3:**
```
Input: root = [1]
Output: 0
Explanation: One node alone has no edge.
```

**Constraints:**
- The tree holds between `0` and `10^4` nodes.
- `-1000 <= Node.val <= 1000`
- The depth never exceeds `1000`.

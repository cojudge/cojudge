You are given the root of a binary tree whose nodes hold only `0` or `1`. Remove every subtree that contains no `1` anywhere inside it.

Concretely, process the tree from the leaves upward: if a node's entire subtree (itself plus all descendants) holds only zeros, delete that subtree. A node with value `1` always survives, and a zero node survives only when at least one descendant kept for the same reason exists.

Return the root of the trimmed tree, or null when nothing remains.

**Example 1:**
```
Input: root = [1,null,0,0,1]
Output: [1,null,0,null,1]
Explanation: The lone zero leaf on the lower left has no 1 beneath it and is cut; the zero with a 1 child stays.
```

**Example 2:**
```
Input: root = [1,0,1,0,0,0,1]
Output: [1,null,1,null,1]
Explanation: The whole left zero-only region disappears while the right side keeps its ones.
```

**Example 3:**
```
Input: root = [0,0,0]
Output: []
Explanation: Every subtree is all zeros, so the result is empty.
```

**Constraints:**
- The tree has at most 200 nodes.
- Each node value is `0` or `1`.

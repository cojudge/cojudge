A camera placed on a tree node watches its parent, itself, and its immediate children. Find the smallest number of cameras that together watch every node of the tree described by the level-order serialization `root`. (Node values are irrelevant; only the shape matters.) An empty tree needs no cameras.

**Example 1:**
```
Input: root = [0,0,null,0,0]
Output: 1
Explanation: One camera on the left child watches the root and both grandchildren, covering everything.
```

**Example 2:**
```
Input: root = [0,0,null,0,null,0,null,null,0]
Output: 2
Explanation: The long chain forces two cameras; a single device always leaves one end unwatched.
```

**Example 3:**
```
Input: root = [0]
Output: 1
Explanation: A lone node must host its own camera.
```

**Constraints:**
- The tree holds between 0 and 1000 nodes.
- Node values are integers fitting in a 32-bit signed range.

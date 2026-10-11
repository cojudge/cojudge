Given the root of a binary tree (serialised level by level, with `null` for missing
children), find the length, in nodes, of the longest downward path whose values rise by
exactly 1 at every step. The path must follow parent-to-child links. An empty tree scores 0.

**Example 1:**
```
Input: root = [1,null,3,2,4,null,null,null,5]
Output: 3
Explanation: The path 3 -> 4 -> 5 has length 3.
```

**Example 2:**
```
Input: root = [2,null,3,2,null,1]
Output: 2
Explanation: Both 2 -> 3 and 1 -> 2 have length 2.
```

**Example 3:**
```
Input: root = []
Output: 0
Explanation: An empty tree has no path.
```

**Constraints:**
- The tree holds between 0 and 2000 nodes.
- `-10^9 <= node values <= 10^9`.

Extend neighbor linking to any binary tree, not just perfect ones.

For every node, imagine an arrow to the closest node on the same depth to its right (or nothing if it is the row's last node). Fill in all such arrows level by level and return the root.

**Example 1:**
```
Input: root = [1,2,3,4,5,null,7]
Output: [1,2,3,4,5,null,7]
Explanation: Row 2 links 2 -> 3; row 3 links 4 -> 5 -> 7 across the gap left by the missing child. Serialization is unchanged.
```

**Example 2:**
```
Input: root = []
Output: []
```

**Constraints:**
- `0 <= number of nodes <= 6000`
- `-100 <= Node.val <= 100`

**Adaptation note:** The original statement uses a `Node` type with `left`, `right`, and `next` fields. This judge models only `TreeNode` (`val`, `left`, `right`); neighbor links cannot be serialized, so solutions return the same tree and grading verifies that values and structure are preserved.

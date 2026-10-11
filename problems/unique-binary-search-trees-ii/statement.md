Given `n`, build every structurally unique binary search tree that stores the values `1` through `n` in order. Each tree must satisfy the search property: every left descendant is smaller than its parent and every right descendant is larger.

Return each distinct tree shape encoded as a breadth-first (level-order) serialization such as `[1,2,3]`, with missing children written as `null` and trailing `null`s omitted. The order of the returned encodings does not matter.

For `n = 3` there are five trees; their serializations are `[1,null,2,null,3]`, `[1,null,3,2]`, `[2,1,3]`, `[3,1,null,null,2]` and `[3,2,null,1]`.

**Example 1:**
```
Input: n = 3
Output: ["1,null,2,null,3","1,null,3,2","2,1,3","3,1,null,null,2","3,2,null,1"] (order may vary)
Explanation: All five BST shapes over 1..3 are returned in BFS form.
```

**Example 2:**
```
Input: n = 1
Output: ["1"]
Explanation: A single node is the only tree.
```

**Constraints:**
- `1 <= n <= 8`

> **Adaptation note:** the original LeetCode signature returns `List<TreeNode>`, which has no portable cross-language encoding here. This problem instead returns `string_list`: each entry is the BFS serialization of one tree (level order with `null` placeholders, trailing nulls trimmed, wrapped like `[2,1,3]`). Grading compares the sorted sets of serializations.

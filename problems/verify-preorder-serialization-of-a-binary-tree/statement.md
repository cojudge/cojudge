A binary tree can be written down by walking it in preorder (node first, then left branch, then right branch). Each visited position contributes one token: the node's stored number when the position holds a real node, or the marker `#` when the position is an empty child. Tokens are joined with commas into a single line.

For instance, a small tree might become `"9,3,4,#,#,1,#,#,2,#,6,#,#"`, where every `#` stands for a missing child.

You receive such a comma-separated line `preorder`. Decide whether it could have arisen from some binary tree walked in preorder. Each token is either a decimal integer or `#`, and the line itself is always well-formed (no blank tokens, no double commas).

You must answer without rebuilding the tree.

**Example 1:**
```
Input: preorder = "9,3,4,#,#,1,#,#,2,#,6,#,#"
Output: true
Explanation: The tokens line up with a complete preorder walk: every real node supplies exactly two child slots and every `#` consumes one.
```

**Example 2:**
```
Input: preorder = "1,#"
Output: false
Explanation: The root claims two child slots but only one token follows, so one slot stays empty.
```

**Example 3:**
```
Input: preorder = "9,#,#,1"
Output: false
Explanation: The first three tokens already describe a finished tree, leaving the trailing `1` with nowhere to attach.
```

**Constraints:**
- `1 <= preorder.length <= 10^4`
- Tokens are integers in `[0, 100]` or `#`, separated by single commas.

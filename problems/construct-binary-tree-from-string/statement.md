You are given a string that encodes a binary tree. The encoding works like this: a node's integer value comes first (possibly negative, possibly several digits), then its left subtree wrapped in parentheses, then its right subtree wrapped in parentheses. A missing child is simply omitted (never written as empty parentheses). For example, `1(2)(3)` is a root `1` with left child `2` and right child `3`, while `1(2)` has only a left child.

Build the tree described by the string and return its root. An empty string means there is no tree, so return null.

**Example 1:**
```
Input: s = "4(2(3)(1))(6(5))"
Output: [4,2,6,3,1,5]
Explanation: Root 4 has left subtree 2 (with children 3 and 1) and right child 6 (with left child 5).
```

**Example 2:**
```
Input: s = "4(2(3)(1))(6(5)(7))"
Output: [4,2,6,3,1,5,7]
Explanation: As above, plus 6 gains right child 7.
```

**Example 3:**
```
Input: s = "-4(2(3)(1))(6(5)(7))"
Output: [-4,2,6,3,1,5,7]
Explanation: Node values may be negative; the shape is unchanged.
```

**Constraints:**
- `0 <= s.length <= 3 * 10^4`
- `s` is either empty or a valid encoding: integers (with optional leading `-`), parentheses balanced, no empty `()` pairs.
- Node values fit in a 32-bit signed integer.

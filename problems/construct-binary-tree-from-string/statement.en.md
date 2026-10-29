You are given a string that encodes a binary tree. The encoding works like this: a node's integer value comes first (possibly negative, possibly several digits), then its left subtree wrapped in parentheses, then its right subtree wrapped in parentheses. A missing child is simply omitted (never written as empty parentheses). For example, `1(2)(3)` is a root `1` with left child `2` and right child `3`, while `1(2)` has only a left child.

Build the tree described by the string and return its root. An empty string means there is no tree, so return null.

**Constraints:**
- `0 <= s.length <= 3 * 10^4`
- `s` is either empty or a valid encoding: integers (with optional leading `-`), parentheses balanced, no empty `()` pairs.
- Node values fit in a 32-bit signed integer.

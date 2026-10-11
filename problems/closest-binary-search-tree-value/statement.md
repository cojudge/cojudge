Given the root of a binary search tree and a decimal `target` passed as a string (for example `"3.714286"`), return the tree value numerically closest to `target`.

This is a portable adaptation: parse `target` as a double and compare distances numerically. When two values are equally close, return the smaller one.

**Constraints:**
- `1 <= number of nodes <= 10^4`
- `-10^4 <= Node.val <= 10^4`
- The tree is a valid binary search tree.
- `"-10^5" <= target <= "10^5"` as a decimal string parseable by a double.

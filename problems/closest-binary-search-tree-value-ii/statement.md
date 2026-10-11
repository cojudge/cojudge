Given the root of a binary search tree, a decimal `target` passed as a string (for example `"3.714286"`) and an integer `k`, return the `k` tree values numerically closest to `target`. Return them in any order.

This is a portable adaptation: parse `target` as a double and compare distances numerically. A checker accepts any set of `k` values whose largest distance does not exceed the smallest distance outside the set.

**Constraints:**
- `1 <= number of nodes <= 10^4`
- `1 <= k <= number of nodes`
- `-10^4 <= Node.val <= 10^4`
- The tree is a valid binary search tree.
- `target` is a decimal string parseable by a double.

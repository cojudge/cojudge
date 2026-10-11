You are handed the root of a binary search tree, where every left descendant
is smaller than its parent and every right descendant is larger. Look at all
pairs of distinct nodes and measure the absolute gap between their values.
Return the smallest gap you can find.

Because the values arrive in sorted order during an in-order walk, the
closest pair in value must sit next to each other in that order, so a single
pass is enough.

**Constraints:**
- The tree holds between 2 and 100 nodes.
- `0 <= Node.val <= 10^5`
- The input is guaranteed to satisfy search-tree ordering.

You are given the root of a binary tree whose nodes hold digits `0` through `9`. Every path from the root down to a leaf spells a decimal number by concatenating the digits along the way.

For instance, the path `1 -> 2 -> 3` stands for `123`.

Add up the numbers spelled by all root-to-leaf paths and return the total. The answer fits in a 32-bit integer. A leaf is a node with no children.

**Constraints:**
- The tree holds between 1 and 1000 nodes.
- `0 <= Node.val <= 9`
- Tree depth is at most 10.

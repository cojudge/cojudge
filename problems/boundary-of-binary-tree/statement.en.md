You are given the root of a binary tree. List the values on its outer edge in counter-clockwise order, starting at the root.

The required order is: the root first (unless the tree is empty), then the left edge from top to bottom excluding any leaves, then all leaves from left to right, then the right edge from bottom to top excluding any leaves. No node appears twice; when the root itself is a leaf it is listed once.

The left edge follows left children when possible, otherwise right children, down to but not including the leftmost leaf. The right edge mirrors this on the right side.

Return the collected values as a list.

**Constraints:**
- `0 <= number of nodes <= 10^4`
- `-1000 <= Node.val <= 1000`

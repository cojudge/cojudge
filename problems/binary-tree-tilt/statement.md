Given the root of a binary tree, compute its total tilt. The tilt of a single node is the absolute difference between the sum of all values in its left subtree and the sum of all values in its right subtree. The tilt of the whole tree is the sum of every node's tilt.

Empty subtrees contribute 0 to the sums. A leaf therefore always has tilt 0, while its value still counts toward its ancestors' sums.

**Constraints:**
- The node count is in `[0, 10^4]`.
- `-1000 <= Node.val <= 1000`

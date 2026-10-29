Determine whether any root-to-leaf chain in a binary tree adds up to a given total.

Start at the root with the full target. At each step, subtract the current node's value and continue to its children. When a leaf (a node with no children) is reached, success means the leftover amount is zero. Interior nodes never count, even if the partial sum matches early.

Return `true` if at least one qualifying leaf route exists, otherwise `false`.

**Constraints:**
- `0 <= number of nodes <= 5000`
- `-1000 <= Node.val <= 1000`
- `-1000 <= targetSum <= 1000`

You are given the root of a binary tree plus an integer `target`. Strip out every leaf whose value equals `target`.

Removal cascades: after deleting such a leaf, when its parent turns into a leaf that also stores `target`, that parent is stripped as well. Repeat this pruning until no matching leaf is left, then return the resulting root.

**Constraints:**
- The number of nodes in the tree is in the range `[1, 3000]`
- `1 <= Node.val, target <= 1000`

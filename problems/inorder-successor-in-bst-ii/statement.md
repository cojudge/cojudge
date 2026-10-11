A binary search tree stores pairwise different values with the usual ordering: everything in the left subtree is smaller than the node, everything in the right subtree is larger. In the classic follow-up each node also knows its parent, so the successor can be found from the target node alone by walking down and up.

**Adaptation used here.** Parent references cannot travel through this judge's value-based interface, so the tree is passed explicitly together with its parent links: `root` is the level-order serialization (with `null` gaps, e.g. `"[2,1,3]"`), `parents` encodes one parent value per non-`null` entry of `root` in the same left-to-right order (`null` for the tree root), and `p` is the value of the target node. For example, `root = [2,1,3]` pairs with `parents = [null,2,2]` because nodes 1 and 3 both have parent 2. Rebuild the parent links from that pair, then answer exactly as the parent-pointer version would.

Given this encoding and a target value `p` present in the tree, return the value of the node visited straight after `p` in inorder order. Return `-1` when `p` is the largest value (or when the tree is empty / `p` is absent).

**Constraints:**
- `0 <= number of nodes <= 10^4`
- `-10^5 <= Node.val <= 10^5`
- All values are unique; the tree is a valid binary search tree
- `parents` has one entry per non-null value of `root`, in matching order

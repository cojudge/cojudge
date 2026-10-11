Collect every root-to-leaf chain whose values add up to a target total.

Explore the tree depth-first while keeping the current path. At each node, extend the path and reduce the remaining sum. When a leaf is reached, keep a snapshot of the path if its sum matches the target; otherwise discard it. Then backtrack and try the next branch.

Return all matching paths as value lists ordered from root to leaf. The checker treats path order as insignificant but each individual path must run root-first.

**Constraints:**
- `0 <= number of nodes <= 5000`
- `-1000 <= Node.val <= 1000`
- `-1000 <= targetSum <= 1000`

**Adaptation note:** The nested value list is represented as `int_list_2d` in this judge.

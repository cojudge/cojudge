Turn an ascending integer list into a height-balanced binary search tree.

A height-balanced tree requires that, for every node, the depths of its two subtrees differ by at most one. Combined with the search-tree ordering (left values smaller, right values larger), this keeps the tree shallow. Choose elements so both sides stay even, build each side the same way, and return the root.

Because several balanced shapes can be valid, any height-balanced search tree containing exactly the input values is accepted.

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-10^4 <= nums[i] <= 10^4`
- `nums` is sorted in strictly increasing order.

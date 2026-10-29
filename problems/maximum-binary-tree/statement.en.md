You are given an array `nums` with all distinct values.

Build the maximum binary tree as follows, applied recursively to each slice of the array:

- Find the largest value in the slice; it becomes the root of this branch.
- The part of the slice left of that maximum forms the left subtree by the same rule.
- The part of the slice right of that maximum forms the right subtree by the same rule.

Return the root of the finished tree.

**Constraints:**
- `1 <= nums.length <= 1000`
- `0 <= nums[i] <= 1000`
- All values are distinct.

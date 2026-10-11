Turn an ascending integer list into a height-balanced binary search tree.

A height-balanced tree requires that, for every node, the depths of its two subtrees differ by at most one. Combined with the search-tree ordering (left values smaller, right values larger), this keeps the tree shallow. Choose elements so both sides stay even, build each side the same way, and return the root.

Because several balanced shapes can be valid, any height-balanced search tree containing exactly the input values is accepted.

**Example 1:**
```
Input: nums = [-10,-3,0,5,9]
Output: [0,-3,9,-10,null,5]
Explanation: 0 becomes the root, [-10,-3] forms the left subtree and [5,9] the right subtree. Other balanced arrangements also count.
```

**Example 2:**
```
Input: nums = [1,3]
Output: [3,1]
Explanation: Either endpoint can serve as root while staying balanced.
```

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-10^4 <= nums[i] <= 10^4`
- `nums` is sorted in strictly increasing order.

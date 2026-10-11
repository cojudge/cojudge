You are given an array `nums` with all distinct values.

Build the maximum binary tree as follows, applied recursively to each slice of the array:

- Find the largest value in the slice; it becomes the root of this branch.
- The part of the slice left of that maximum forms the left subtree by the same rule.
- The part of the slice right of that maximum forms the right subtree by the same rule.

Return the root of the finished tree.

**Example 1:**
```
Input: nums = [3,2,1,6,0,5]
Output: [6,3,5,null,2,0,null,null,1]
Explanation: 6 is the overall maximum. The left part [3,2,1] and right part [0,5] are built the same way.
```

**Example 2:**
```
Input: nums = [3,2,1]
Output: [3,null,2,null,1]
Explanation: Each step picks the first entry as the maximum of what remains.
```

**Constraints:**
- `1 <= nums.length <= 1000`
- `0 <= nums[i] <= 1000`
- All values are distinct.

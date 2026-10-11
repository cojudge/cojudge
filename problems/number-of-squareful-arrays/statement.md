A non-negative integer is a perfect square when some integer multiplied by
itself equals it (for example, `1`, `4`, `9` and `16` are perfect squares).

An array is squareful when every pair of adjacent elements adds up to a
perfect square.

Given an integer array `nums`, return how many distinct permutations of its
elements are squareful. Permutations that look identical because of repeated
values are counted once.

**Example 1:**
```
Input: nums = [1,17,8]
Output: 2
Explanation: The squareful orderings are [1,8,17] and [17,8,1].
```

**Example 2:**
```
Input: nums = [2,2,2]
Output: 1
Explanation: Only [2,2,2] exists, and 2 + 2 = 4 is a perfect square.
```

**Constraints:**
- `1 <= nums.length <= 12`
- `0 <= nums[i] <= 10^9`

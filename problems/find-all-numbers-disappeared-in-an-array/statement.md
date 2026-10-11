You are given a list `nums` with `n` entries where each value lies between `1` and `n`. Some numbers in that range appear twice while others never appear.

Return every number between `1` and `n` that never appears in `nums`, in increasing order.

> **Adaptation note:** the original LeetCode return type is `List<Integer>`; this problem uses the portable `int_list` output type with the same values in the same order.

**Example 1:**
```
Input: nums = [4,3,2,7,8,2,3,1]
Output: [5,6]
Explanation: Values 5 and 6 from 1..8 are absent.
```

**Example 2:**
```
Input: nums = [1,1]
Output: [2]
Explanation: With n = 2, value 2 never shows up.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= nums.length`

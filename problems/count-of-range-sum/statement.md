You are given an integer array `nums` and two integers `lower` and `upper`. A *range sum* is the sum of a contiguous, non-empty block of the array. Count how many range sums fall inside the closed interval `[lower, upper]` and return that count.

**Example 1:**
```
Input: nums = [-2,5,-1], lower = -2, upper = 2
Output: 3
Explanation: The qualifying blocks are [0,0] with sum -2, [2,2] with sum -1, and [0,2] with sum 2.
```

**Example 2:**
```
Input: nums = [0], lower = 0, upper = 0
Output: 1
Explanation: The single block [0,0] sums to 0, which lies in range.
```

**Example 3:**
```
Input: nums = [1,2,3], lower = 3, upper = 5
Output: 3
Explanation: The blocks [0,1], [1,2] and [2,2] sum to 3, 5 and 3 respectively.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `-2^31 <= nums[i] <= 2^31 - 1`
- `-10^5 <= lower <= upper <= 10^5`
- The answer fits in a 32-bit signed integer.

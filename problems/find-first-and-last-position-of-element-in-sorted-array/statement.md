You receive an integer array `nums` sorted in non-decreasing order and an integer `target`. Find the first and last positions where `target` appears, and return them as a two-element array `[first, last]`.

When `target` does not occur at all, return `[-1, -1]`. Your method should run in logarithmic time rather than scanning the whole array.

**Example 1:**
```
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]
Explanation: The value 8 occupies indices 3 and 4.
```

**Example 2:**
```
Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]
Explanation: No entry equals 6.
```

**Example 3:**
```
Input: nums = [], target = 0
Output: [-1,-1]
Explanation: An empty array contains nothing.
```

**Constraints:**
- `0 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `nums` is sorted in non-decreasing order.
- `-10^9 <= target <= 10^9`

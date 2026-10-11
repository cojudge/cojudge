An array `nums` of length `n` should hold each number `1..n` exactly once, but one value appears twice while another value from the range is missing entirely. Find both.

Implement `findErrorNums(nums)` returning `[duplicate, missing]`: the repeated value first, then the absent value.

**Example 1:**
```
Input: nums = [1,2,2,4]
Output: [2,3]
Explanation: 2 occurs twice and 3 never occurs.
```

**Example 2:**
```
Input: nums = [1,1]
Output: [1,2]
```

**Example 3:**
```
Input: nums = [3,2,2]
Output: [2,1]
```

**Constraints:**
- `2 <= nums.length <= 10^4`
- `1 <= nums[i] <= nums.length`
- Exactly one value repeats and exactly one value is missing.

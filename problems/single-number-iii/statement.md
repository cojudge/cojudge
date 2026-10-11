Given an integer array `nums` where every value appears twice except for exactly two values that appear once, find those two single values. Return them in any order.

Your algorithm should run in linear time and use only constant extra space.

**Example 1:**
```
Input: nums = [1,2,1,3,2,5]
Output: [3,5]
Explanation: 1 and 2 each appear twice, leaving 3 and 5. Returning [5,3] is also accepted.
```

**Example 2:**
```
Input: nums = [-1,0]
Output: [-1,0]
Explanation: Both values appear once, so both are returned.
```

**Example 3:**
```
Input: nums = [0,1]
Output: [1,0]
Explanation: Either order is accepted.
```

**Constraints:**
- `2 <= nums.length <= 3 * 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`
- Exactly two values appear once and all others appear twice.

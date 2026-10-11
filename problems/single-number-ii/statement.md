Every value in `nums` occurs exactly three times except for one value that occurs once. Find that lone value.

Your algorithm should run in linear time and use only constant extra space.

**Example 1:**
```
Input: nums = [2,2,3,2]
Output: 3
Explanation: 2 appears three times while 3 appears once.
```

**Example 2:**
```
Input: nums = [0,1,0,1,0,1,99]
Output: 99
Explanation: 0 and 1 each appear three times; 99 is the single one.
```

**Constraints:**
- `1 <= nums.length <= 3 * 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`
- All but one element appear three times; one appears once.

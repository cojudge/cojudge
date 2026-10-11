For a non-empty integer list `nums`, call its degree the largest number of times any single value occurs. Find the shortest contiguous block that has the same degree as the whole list, and return that block's length.

**Example 1:**
```
Input: nums = [1,2,2,3,1]
Output: 2
Explanation: Both 1 and 2 occur twice, so the degree is 2; the slice [2,2] achieves it with length 2.
```

**Example 2:**
```
Input: nums = [1,2,2,3,1,4,2]
Output: 6
Explanation: The value 2 occurs three times; the span from its first to its last appearance covers indexes 1 to 6.
```

**Example 3:**
```
Input: nums = [1,1,2,2,2,1]
Output: 3
Explanation: The value 2 occurs three times in the middle slice [2,2,2].
```

**Constraints:**
- `1 <= nums.length <= 50000`
- `0 <= nums[i] <= 49999`

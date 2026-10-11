You are given an integer array `nums` already ordered from smallest to largest. It may contain negative values.

Square every entry and return the results ordered from smallest to largest.

**Example 1:**
```
Input: nums = [-4,-1,0,3,10]
Output: [0,1,9,16,100]
Explanation: The squares are [16,1,0,9,100]; sorting gives [0,1,9,16,100].
```

**Example 2:**
```
Input: nums = [-7,-3,2,3,11]
Output: [4,9,9,49,121]
Explanation: The squares sorted increasingly are [4,9,9,49,121].
```

**Constraints:**
- `1 <= nums.length <= 10000`
- `-10000 <= nums[i] <= 10000`
- `nums` is sorted in non-decreasing order.

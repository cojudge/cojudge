Given an integer array `nums`, find the length of the longest subarray in which every adjacent pair strictly increases (each element is larger than the one before it).

**Example 1:**
```
Input: nums = [1,3,5,4,7]
Output: 3
Explanation: [1,3,5] is increasing with length 3.
```

**Example 2:**
```
Input: nums = [2,2,2,2,2]
Output: 1
Explanation: Every run has length 1.
```

**Example 3:**
```
Input: nums = [1,3,5,7]
Output: 4
```

**Constraints:**
- `0 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`

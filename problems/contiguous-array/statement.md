You are given a binary array `nums` containing only `0`s and `1`s. Find the length of the longest contiguous subarray that holds an equal number of `0`s and `1`s. If no such subarray exists, return `0`.

**Example 1:**
```
Input: nums = [0,1]
Output: 2
Explanation: The whole array has one 0 and one 1.
```

**Example 2:**
```
Input: nums = [0,1,0]
Output: 2
Explanation: Both [0,1] and [1,0] are balanced with length 2.
```

**Example 3:**
```
Input: nums = [0,0,1,0,0,0,1,1]
Output: 6
Explanation: The slice from index 2 to index 7, [1,0,0,0,1,1], has three 0s and three 1s.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `nums[i]` is either `0` or `1`.

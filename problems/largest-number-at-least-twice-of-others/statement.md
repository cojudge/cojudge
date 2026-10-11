You are given an integer array `nums` in which the largest value occurs exactly once.

Locate the biggest entry. If it is at least twice as large as every other entry, return its index. Otherwise return `-1`.

**Example 1:**
```
Input: nums = [3,6,1,0]
Output: 1
Explanation: The biggest value is 6 at index 1. It doubles 3 to 6, beats 1 doubled, and beats 0, so the answer is 1.
```

**Example 2:**
```
Input: nums = [1,2,3,4]
Output: -1
Explanation: The biggest value is 4, but 4 is smaller than twice 3, so the condition fails.
```

**Example 3:**
```
Input: nums = [10,5,3]
Output: 0
Explanation: The biggest value 10 at index 0 reaches twice 5 and more than twice 3.
```

**Constraints:**
- `2 <= nums.length <= 50`
- `0 <= nums[i] <= 100`
- The largest entry of `nums` is unique.

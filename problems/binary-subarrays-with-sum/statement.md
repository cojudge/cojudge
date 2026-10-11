You are given a binary array `nums` (only `0`s and `1`s) and an integer `goal`. A subarray is a consecutive slice of the array. Return how many subarrays have a sum exactly equal to `goal`.

**Example 1:**
```
Input: nums = [1,0,1,0,1], goal = 2
Output: 4
Explanation: The four slices with two ones are [1,0,1], [1,0,1,0], [0,1,0,1], [1,0,1].
```

**Example 2:**
```
Input: nums = [0,0,0,0,0], goal = 0
Output: 15
Explanation: Every one of the 5*6/2 slices sums to zero.
```

**Example 3:**
```
Input: nums = [1,1,1,1,1], goal = 3
Output: 3
```

**Constraints:**
- `1 <= nums.length <= 30000`
- Each entry is `0` or `1`.
- `0 <= goal <= nums.length`

Given an integer array `nums`, find the length of the shortest continuous subarray that, once sorted in non-decreasing order, makes the entire array sorted. Return 0 when the array is already sorted.

Compare against the fully sorted copy: the leftmost index where they differ starts the window and the rightmost such index ends it. Everything outside the window already sits in its final place.

**Example 1:**
```
Input: nums = [2,6,4,8,10,9,15]
Output: 5
Explanation: Sorting positions 1 through 5 fixes the array; the window [6,4,8,10,9] has length 5.
```

**Example 2:**
```
Input: nums = [1,2,3,4]
Output: 0
Explanation: The array is already sorted.
```

**Example 3:**
```
Input: nums = [1]
Output: 0
Explanation: A single element needs no sorting.
```

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-10^5 <= nums[i] <= 10^5`

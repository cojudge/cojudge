Given an integer array `nums`, find the length of the shortest continuous subarray that, once sorted in non-decreasing order, makes the entire array sorted. Return 0 when the array is already sorted.

Compare against the fully sorted copy: the leftmost index where they differ starts the window and the rightmost such index ends it. Everything outside the window already sits in its final place.

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-10^5 <= nums[i] <= 10^5`

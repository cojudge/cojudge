Imagine an ascending array rotated between 1 and n times, where duplicates are allowed. For example, `[0,1,4,4,5,6,7]` rotated 4 times can become `[4,5,6,7,0,1,4]`.

Given such a rotated array `nums`, return its smallest element. Try to reduce the number of steps as much as possible, even though duplicates prevent a pure logarithmic guarantee.

**Constraints:**
- `n == nums.length`
- `1 <= n <= 5000`
- `-5000 <= nums[i] <= 5000`
- `nums` is a sorted array rotated between 1 and n times.

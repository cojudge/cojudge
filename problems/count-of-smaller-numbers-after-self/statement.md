You are given an integer array `nums`. For every position `i`, count how many elements strictly smaller than `nums[i]` appear to its right (at indices greater than `i`). Collect these counts into an array of the same length and return it.

*Adaptation note:* the original statement returns a list of integers; here the result is returned as a plain integer array with identical contents and order.

**Constraints:**
- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

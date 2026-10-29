You are given an integer array `nums` and two non-negative limits `indexDiff` and `valueDiff`. Decide whether there exist two different positions `i` and `j` such that the positions are close and the values are close at the same time:

- `abs(i - j) <= indexDiff`, and
- `abs(nums[i] - nums[j]) <= valueDiff`.

**Constraints:**
- `1 <= nums.length <= 10^5`
- `-2^31 <= nums[i] <= 2^31 - 1`
- `0 <= indexDiff <= 10^5`
- `0 <= valueDiff <= 2^31 - 1`

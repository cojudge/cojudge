Design an algorithm that reports the `k`th largest value in an integer stream after each new value arrives.

Implement `kthLargestStream(k, nums, additions)`. Initialize the stream with every value in `nums`. Then process `additions` from left to right. After inserting each value, append the current `k`th largest stream value to the result.

This is a portable function adaptation of the original constructor-and-`add` API. `nums` may initially contain fewer than `k` values, but after every insertion from `additions` the stream contains at least `k` values.

**Constraints:**

- `1 <= k <= nums.length + 1`
- `0 <= nums.length <= 10^4`
- `1 <= additions.length <= 10^4`
- `-10^4 <= nums[i], additions[i] <= 10^4`
- After each addition, the total number of stream values is at least `k`.

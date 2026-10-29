Split the array `nums` into exactly `k` non-empty consecutive groups. The score of a split is the sum of the average of each group. Return the maximum achievable score.

For instance, `[9,1,2,3,9]` with `k = 3` is best cut as `[9]`, `[1,2,3]`, `[9]`, scoring `9 + 2 + 9 = 20`.

Adaptation note: the original task returns a floating number. Here, return the score as a decimal string (for example `"20.0"`). The judge parses your string as a double and accepts it within an absolute tolerance of 1e-9 plus a relative tolerance of 1e-5.

**Constraints:**
- `1 <= nums.length <= 100`
- `1 <= nums[i] <= 10000`
- `1 <= k <= nums.length`

You are handed a list of integers `nums`. Determine whether it hides three positions `i < j < k` whose values climb strictly, i.e. `nums[i] < nums[j] < nums[k]`.

The three entries need not sit next to each other — only their order and values matter. Return `true` when such a triple exists and `false` otherwise.

**Constraints:**
- `1 <= nums.length <= 5 * 10^5`
- `-2^31 <= nums[i] <= 2^31 - 1`

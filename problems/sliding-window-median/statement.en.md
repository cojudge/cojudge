Slide a window of exactly `k` spots from the left end of `nums` to the right end, one step at a time. For each placement, sort that slice in your head and take its middle value — or the mean of the two middle values when `k` is even. Collect those medians in order.

**Portable adaptation:** Medians can be fractional (ending in `.5`), and this judge has no double type. Each median is therefore returned as a decimal string (for example `"2.5"` or `"1.0"`), and grading accepts any decimal within `1e-5` of the true value.

**Constraints:**

- `1 <= k <= nums.length <= 10^5`
- `-2^31 <= nums[i] <= 2^31 - 1`
- Answers within `1e-5` of truth are accepted.

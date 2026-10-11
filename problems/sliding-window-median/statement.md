Slide a window of exactly `k` spots from the left end of `nums` to the right end, one step at a time. For each placement, sort that slice in your head and take its middle value — or the mean of the two middle values when `k` is even. Collect those medians in order.

**Portable adaptation:** Medians can be fractional (ending in `.5`), and this judge has no double type. Each median is therefore returned as a decimal string (for example `"2.5"` or `"1.0"`), and grading accepts any decimal within `1e-5` of the true value.

**Example 1:**

```
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: ["1.0","-1.0","-1.0","3.0","5.0","6.0"]
Explanation: The six windows are [1,3,-1], [3,-1,-3], [-1,-3,5],
[-3,5,3], [5,3,6], [3,6,7]; their middles are 1, -1, -1, 3, 5, 6.
```

**Example 2:**

```
Input: nums = [1,2,3,4,2,3,1,4,2], k = 3
Output: ["2.0","3.0","3.0","3.0","2.0","3.0","2.0"]
Explanation: Every window holds three values, so each median is the middle
of its sorted triple.
```

**Constraints:**

- `1 <= k <= nums.length <= 10^5`
- `-2^31 <= nums[i] <= 2^31 - 1`
- Answers within `1e-5` of truth are accepted.

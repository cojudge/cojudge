Measure the longest subsequence whose steps zigzag up and down.

A wiggle run requires neighboring differences to strictly alternate in sign: positive, negative, positive, and so on. The opening step may point either way. A single value always qualifies with length 1, and any two different values qualify with length 2, while equal neighbors can never sit next to each other in the subsequence. From `nums`, keep a subsequence (deleting entries freely but preserving order) that wiggles and is as long as possible, then return its length.

**Constraints:**
- `1 <= nums.length <= 1000`
- `0 <= nums[i] <= 1000`

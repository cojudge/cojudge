Take an integer list `nums` and an integer `target`. Imagine tagging every entry of
`nums` with either `+` or `-`, leaving the entries in their original sequence,
which yields a signed expression.

Count how many distinct taggings make that expression come out to `target`.
The result is known to fit inside a signed 32-bit integer.

**Constraints:**
- `1 <= nums.length <= 20`
- `0 <= nums[i] <= 1000`
- `0 <= sum(nums) <= 1000`
- `-1000 <= target <= 1000`

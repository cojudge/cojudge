You are given an integer list `nums`. In one move you may pick any `n-1` entries and add `1` to each of them, where `n` is the list length.

Find the smallest number of moves that makes all entries equal.

Raising `n-1` entries by one has the same effect as lowering the single untouched entry by one, so the task equals dragging every value down to the minimum.

**Constraints:**
- `1 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- The answer fits in a 32-bit signed integer.

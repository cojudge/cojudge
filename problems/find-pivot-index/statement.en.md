Find the leftmost position where the sum of elements strictly to its left equals the sum strictly to its right.

Treat a missing side as zero. For `[1,7,3,6,5,6]`, index `3` works because `1+7+3 = 11` and `5+6 = 11`.

Return that index, or `-1` when every position is unbalanced.

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-1000 <= nums[i] <= 1000`

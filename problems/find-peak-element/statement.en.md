A peak is an element that is strictly larger than its neighbours. The first and last elements each have a single neighbour to beat. Every non-empty array has at least one peak, and you may return the index of any of them.

Your answer is checked by position, not by exact index: any index whose element beats its neighbours is accepted.

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`
- Adjacent elements differ (`nums[i] != nums[i+1]`).

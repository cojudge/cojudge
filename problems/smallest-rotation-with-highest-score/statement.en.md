You are handed an array `nums` of length `n` where each entry satisfies `0 <= nums[i] < n`. Rotating left by `k` produces a new arrangement `rot` with `rot[i] = nums[(i + k) % n]`. The score of that rotation counts indices with `rot[i] <= i`.

Return the smallest rotation index `k` that achieves the highest possible score. If several rotations tie, pick the least `k`.

**Constraints:**
- `1 <= nums.length <= 2000`
- `0 <= nums[i] < nums.length`

Count the contiguous groups inside `nums` whose multiplied value stays strictly below `k`.

Every entry of `nums` is positive, so products grow when the window widens and shrink when it narrows. That monotonic behavior allows a linear scan instead of checking every pair.

Return the total number of qualifying subarrays.

**Constraints:**
- `1 <= nums.length <= 3 * 10^4`
- `1 <= nums[i] <= 1000`
- `0 <= k <= 10^6`

You are given an integer array `nums` and an integer `k`. For each element you may pick a shift amount between `-k` and `k` (each element gets its own choice, and choosing `0` leaves it unchanged) and add it to that element.

After all shifts, the score is the difference between the largest and the smallest value. Return the smallest score you can achieve.

**Constraints:**
- `1 <= nums.length <= 50`
- `0 <= nums[i] <= 10000`
- `0 <= k <= 10000`

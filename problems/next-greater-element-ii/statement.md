Imagine the list wrapped into a circle so the element after the last position is the first position again. For each entry, look forward along this circular order for the first strictly larger value. If the full loop contains no larger value, record `-1` for that spot.

Return the list of answers aligned with the input order.

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`

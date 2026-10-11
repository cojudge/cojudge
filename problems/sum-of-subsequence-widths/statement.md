For any non-empty collection of numbers, look at the gap between its biggest entry and its tiniest entry. A lone element therefore has a gap of zero.

You are handed an integer array `nums`. Think about every subsequence you can build by keeping some elements and dropping the rest while preserving their relative order (the kept elements need not sit next to each other). Add up the gap of each such subsequence, then give the total modulo `10^9 + 7`.

**Constraints:**
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^5`

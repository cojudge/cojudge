Given a non-decreasing integer array, keep at most two copies of each distinct value while preserving the relative order. Rearrange the front of the array so the first `k` entries hold the kept values, and return `k`.

Only the returned length is graded; the contents beyond position `k` are ignored. The update must reuse the input array without allocating another large array.

**Constraints:**
- `1 <= nums.length <= 30000`
- `-10000 <= nums[i] <= 10000`
- `nums` is sorted in non-decreasing order.

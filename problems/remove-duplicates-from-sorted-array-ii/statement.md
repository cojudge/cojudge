Given a non-decreasing integer array, keep at most two copies of each distinct value while preserving the relative order. Rearrange the front of the array so the first `k` entries hold the kept values, and return `k`.

Only the returned length is graded; the contents beyond position `k` are ignored. The update must reuse the input array without allocating another large array.

**Example 1:**
```
Input: nums = [1,1,1,2,2,3]
Output: 5
Explanation: The first 5 entries become [1,1,2,2,3]; one extra 1 is dropped.
```

**Example 2:**
```
Input: nums = [0,0,1,1,1,1,2,3,3]
Output: 7
Explanation: The first 7 entries become [0,0,1,1,2,3,3]; two extra 1s are dropped.
```

**Constraints:**
- `1 <= nums.length <= 30000`
- `-10000 <= nums[i] <= 10000`
- `nums` is sorted in non-decreasing order.

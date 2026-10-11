Count the contiguous groups inside `nums` whose multiplied value stays strictly below `k`.

Every entry of `nums` is positive, so products grow when the window widens and shrink when it narrows. That monotonic behavior allows a linear scan instead of checking every pair.

Return the total number of qualifying subarrays.

**Example 1:**
```
Input: nums = [10,5,2,6], k = 100
Output: 8
Explanation: The valid windows are [10], [5], [2], [6], [10,5], [5,2], [2,6] and [5,2,6].
```

**Example 2:**
```
Input: nums = [1,2,3], k = 0
Output: 0
Explanation: Positive products can never drop below zero.
```

**Example 3:**
```
Input: nums = [1,1,1], k = 2
Output: 6
Explanation: All 3 singles, both pairs and the triple qualify.
```

**Constraints:**
- `1 <= nums.length <= 3 * 10^4`
- `1 <= nums[i] <= 1000`
- `0 <= k <= 10^6`

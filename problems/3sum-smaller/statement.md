Given an integer array `nums` and an integer `target`, count the index triples `(i, j, k)` with `i < j < k` whose values sum to less than `target`.

**Example 1:**
```
Input: nums = [-2,0,1,3], target = 2
Output: 2
Explanation: The triples ([-2,0,1]) and ([-2,0,3]) sum to -1 and 1, both below 2.
```

**Example 2:**
```
Input: nums = [], target = 0
Output: 0
Explanation: Fewer than three values means no triple exists.
```

**Example 3:**
```
Input: nums = [3,1,0,-2], target = 4
Output: 3
Explanation: Three of the four possible triples fall below 4.
```

**Constraints:**
- `0 <= nums.length <= 10^4`
- `-10^4 <= nums[i] <= 10^4`
- `-10^4 <= target <= 10^4`

Given an integer array `nums`, count ordered triples of indices `(i, j, k)` with `0 <= i, j, k < nums.length` such that `nums[i] AND nums[j] AND nums[k] == 0`. The bitwise AND combines all three values. Indices may repeat, and different index orders count separately.

**Example 1:**
```
Input: nums = [2,1,3]
Output: 12
Explanation: Twelve of the 27 ordered triples AND to zero.
```

**Example 2:**
```
Input: nums = [0,0,0]
Output: 27
Explanation: All 27 triples qualify.
```

**Constraints:**
- `1 <= nums.length <= 500`
- `0 <= nums[i] < 2^16`

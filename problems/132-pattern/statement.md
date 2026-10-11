You are given an array `nums`. A `132 pattern` is a triple of positions `i < j < k` whose values sit in small-large-middle order:

```
nums[i] < nums[k] < nums[j]
```

Return `true` if such a triple exists, and `false` otherwise.

**Example 1:**
```
Input: nums = [1,2,3,4]
Output: false
Explanation: Every triple is increasing, so no value lands strictly between a smaller earlier value and a larger middle value.
```

**Example 2:**
```
Input: nums = [3,1,4,2]
Output: true
Explanation: Indices 1, 2, 3 hold 1, 4, 2, and 1 < 2 < 4.
```

**Example 3:**
```
Input: nums = [-1,3,2,0]
Output: true
Explanation: Indices 0, 1, 2 hold -1, 3, 2, and -1 < 2 < 3.
```

**Constraints:**
- `1 <= nums.length <= 2 * 10^5`
- `-10^9 <= nums[i] <= 10^9`

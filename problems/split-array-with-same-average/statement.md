You receive an integer array `nums`. Decide whether it can be divided into two non-empty groups `A` and `B` that together use every element exactly once and whose arithmetic means are equal.

Equal means imply that some non-empty proper subset has sum `total * k / n`, where `k` is its size and `n` is the full length, so the divisibility condition must hold exactly with integers.

**Example 1:**
```
Input: nums = [1,2,3,4,5,6,7,8]
Output: true
Explanation: One valid division is [1,8] plus [2,7] structure rearranged, e.g. groups [1,4,6,8] and [2,3,5,7] share mean 4.75.
```

**Example 2:**
```
Input: nums = [3,1]
Output: false
Explanation: The only splits are singletons with means 3 and 1.
```

**Example 3:**
```
Input: nums = [5,5,5]
Output: true
Explanation: Any singleton versus the remaining pair shares mean 5.
```

**Constraints:**
- `1 <= nums.length <= 30`
- `0 <= nums[i] <= 10^4`

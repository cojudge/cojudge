You are given an integer array `nums` of length `n`. Decide whether three separator positions `i < j < k` can carve the array into four blocks with identical totals.

The separators themselves are discarded: the blocks are `nums[0..i-1]`, `nums[i+1..j-1]`, `nums[j+1..k-1]`, and `nums[k+1..n-1]`. Valid separators must satisfy `0 < i`, `i+1 < j`, `j+1 < k`, and `k < n-1`, so every block holds at least one element.

Return `true` when such a triple exists, else `false`.

**Example 1:**
```
Input: nums = [1,2,1,2,1,2,1]
Output: true
Explanation: Cutting after positions 1, 3 and 5 leaves four blocks each summing to 1.
```

**Example 2:**
```
Input: nums = [1,2,1,2,1,2,1,2]
Output: false
Explanation: No triple of separators yields four equal block sums.
```

**Example 3:**
```
Input: nums = [0,0,0,0,0,0,0]
Output: true
Explanation: All blocks can sum to zero.
```

**Constraints:**
- `1 <= n <= 2000`
- `-10^6 <= nums[i] <= 10^6`

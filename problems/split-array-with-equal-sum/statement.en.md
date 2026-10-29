You are given an integer array `nums` of length `n`. Decide whether three separator positions `i < j < k` can carve the array into four blocks with identical totals.

The separators themselves are discarded: the blocks are `nums[0..i-1]`, `nums[i+1..j-1]`, `nums[j+1..k-1]`, and `nums[k+1..n-1]`. Valid separators must satisfy `0 < i`, `i+1 < j`, `j+1 < k`, and `k < n-1`, so every block holds at least one element.

Return `true` when such a triple exists, else `false`.

**Constraints:**
- `1 <= n <= 2000`
- `-10^6 <= nums[i] <= 10^6`

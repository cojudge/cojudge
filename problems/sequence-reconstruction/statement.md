You are given the intended order `nums`, which lists each number from `1` to `n` exactly once, plus a collection `sequences` where each entry is a shorter list that should appear as a subsequence of the true order.

Decide whether `nums` is the only shortest ordering that contains every listed sequence as a subsequence. Return `true` when the reconstruction is uniquely forced to be `nums`, and `false` otherwise. In particular, return `false` when some value never appears, some listed value falls outside `1..n`, or the ordering constraints allow more than one candidate.

**Example 1:**
```
Input: nums = [1,2,3], sequences = [[1,2],[1,3]]
Output: false
Explanation: Both 1,2,3 and 1,3,2 contain the two pairs, so the order is not forced.
```

**Example 2:**
```
Input: nums = [1,2,3], sequences = [[1,2],[1,3],[2,3]]
Output: true
Explanation: The pairs force 1 before 2, 1 before 3, and 2 before 3, leaving only 1,2,3.
```

**Example 3:**
```
Input: nums = [4,1,5,2,6,3], sequences = [[5,2,6,3],[4,1,5,2]]
Output: true
Explanation: Chained pairs link the whole order with no freedom left.
```

**Constraints:**
- `1 <= nums.length <= 10^4`
- `nums` is a permutation of `1..n`.
- `1 <= sequences.length <= 10^4`
- `0 <= sequences[i].length <= 10^4`
- Values in `sequences` lie in `1..n` for valid cases.

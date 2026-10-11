You are given four integer lists `nums1`, `nums2`, `nums3` and `nums4`, each of length `n`. Count the tuples `(i, j, k, l)` with one index from each list such that `nums1[i] + nums2[j] + nums3[k] + nums4[l]` equals zero.

Indices may repeat across lists but each tuple position comes from its own list.

**Example 1:**
```
Input: nums1 = [1,2], nums2 = [-2,-1], nums3 = [-1,2], nums4 = [0,2]
Output: 2
Explanation: The pairs (0,0,0,1) and (1,1,0,0) sum to zero.
```

**Example 2:**
```
Input: nums1 = [0], nums2 = [0], nums3 = [0], nums4 = [0]
Output: 1
Explanation: The single choice sums to zero.
```

**Constraints:**
- `1 <= n <= 500`
- `-2^28 <= nums1[i], nums2[i], nums3[i], nums4[i] <= 2^28`

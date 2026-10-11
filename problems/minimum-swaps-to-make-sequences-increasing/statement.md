You are given two arrays `nums1` and `nums2` of equal length. At any index `i` you may exchange `nums1[i]` with `nums2[i]` at a cost of one swap; each position is decided independently.

After all choices, both arrays must be strictly increasing from left to right. It is guaranteed that at least one pattern of swaps achieves this.

Return the smallest possible number of swaps.

**Example 1:**
```
Input: nums1 = [1,3,5,4], nums2 = [1,2,3,7]
Output: 1
Explanation: Swapping the last pair gives [1,3,5,7] and [1,2,3,4], both increasing.
```

**Example 2:**
```
Input: nums1 = [0,3,5,8,9], nums2 = [2,1,4,6,9]
Output: 1
Explanation: Swapping index 1 produces [0,1,5,8,9] and [2,3,4,6,9].
```

**Example 3:**
```
Input: nums1 = [1], nums2 = [2]
Output: 0
Explanation: Single-element arrays are already increasing.
```

**Constraints:**
- `1 <= nums1.length == nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 2000`
- A valid swap pattern always exists

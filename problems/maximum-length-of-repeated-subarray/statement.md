Given two integer arrays, find the longest contiguous block that appears in both in the same order.

The block must occupy consecutive positions in each array, though the starting offsets may differ. An empty overlap scores zero.

Return that maximum length.

**Example 1:**
```
Input: nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7]
Output: 3
Explanation: [3,2,1] occurs in both and no longer shared block exists.
```

**Example 2:**
```
Input: nums1 = [0,0,0,0,0], nums2 = [0,0,0,0,0]
Output: 5
Explanation: The whole arrays match.
```

**Example 3:**
```
Input: nums1 = [1,2,3], nums2 = [4,5,6]
Output: 0
Explanation: The value sets are disjoint.
```

**Constraints:**
- `1 <= nums1.length, nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 100`

You receive two integer lists `nums1` and `nums2`. Collect every value that occurs in both lists, keeping each shared value exactly once.

The order of the answer carries no meaning — any arrangement of the shared values is accepted.

**Example 1:**
```
Input: nums1 = [1,2,2,1], nums2 = [2,2]
Output: [2]
Explanation: Only 2 appears in both lists, so it is the sole survivor.
```

**Example 2:**
```
Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
Output: [9,4]
Explanation: Values 4 and 9 are shared; 5 and 8 appear in only one list.
```

**Constraints:**
- `1 <= nums1.length, nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 1000`

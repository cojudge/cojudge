You receive two integer lists `nums1` and `nums2`. Return the values they share, respecting repetition counts: each distinct value should appear in the answer as many times as it appears in both lists simultaneously (the minimum of its two frequencies).

The order of the answer carries no meaning.

**Example 1:**
```
Input: nums1 = [1,2,2,1], nums2 = [2,2]
Output: [2,2]
Explanation: The value 2 occurs twice on each side, so both copies survive.
```

**Example 2:**
```
Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
Output: [4,9]
Explanation: 4 appears once then twice (kept once), 9 appears once then twice (kept once); 5 and 8 are one-sided.
```

**Constraints:**
- `1 <= nums1.length, nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 1000`

**Follow up:** Sort both lists first and walk them with two pointers to use less extra memory; for already-sorted inputs this needs only output space.

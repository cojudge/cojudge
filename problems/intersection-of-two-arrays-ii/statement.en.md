You receive two integer lists `nums1` and `nums2`. Return the values they share, respecting repetition counts: each distinct value should appear in the answer as many times as it appears in both lists simultaneously (the minimum of its two frequencies).

The order of the answer carries no meaning.

**Constraints:**
- `1 <= nums1.length, nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 1000`

**Follow up:** Sort both lists first and walk them with two pointers to use less extra memory; for already-sorted inputs this needs only output space.

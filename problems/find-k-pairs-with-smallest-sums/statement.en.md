List the `k` pairs with the tiniest sums across two sorted arrays.

Both `nums1` and `nums2` arrive sorted from small to large. A pair takes one entry from each array, and its cost is the sum of the two entries. Return exactly `min(k, nums1.length * nums2.length)` pairs with the smallest costs, each written as a two-element row `[u, v]`. Pairs are compared by their sums; when several pairs share the same sum, any order among them is fine.

*Portable adaptation:* the classic version returns a list of boxed lists; here return a plain 2D integer array with the same rows.

**Constraints:**
- `1 <= nums1.length, nums2.length <= 1000` for this portable version (the classic allows larger).
- `-10^9 <= nums1[i], nums2[i] <= 10^9`
- Both arrays are sorted in non-decreasing order.
- `1 <= k <= 10^4`
- `k <= nums1.length * nums2.length`

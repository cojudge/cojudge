List the `k` pairs with the tiniest sums across two sorted arrays.

Both `nums1` and `nums2` arrive sorted from small to large. A pair takes one entry from each array, and its cost is the sum of the two entries. Return exactly `min(k, nums1.length * nums2.length)` pairs with the smallest costs, each written as a two-element row `[u, v]`. Pairs are compared by their sums; when several pairs share the same sum, any order among them is fine.

*Portable adaptation:* the classic version returns a list of boxed lists; here return a plain 2D integer array with the same rows.

**Example 1:**
```
Input: nums1 = [1,7,11], nums2 = [2,4,6], k = 3
Output: [[1,2],[1,4],[1,6]]
Explanation: The sums in order start 3, 5, 7, all using the leading 1 from the first array.
```

**Example 2:**
```
Input: nums1 = [1,1,2], nums2 = [1,2,3], k = 2
Output: [[1,1],[1,1]]
Explanation: Two pairs tie at sum 2; either choice of the duplicated 1 values is fine.
```

**Example 3:**
```
Input: nums1 = [1,2], nums2 = [3], k = 2
Output: [[1,3],[2,3]]
Explanation: Only two pairs exist, ordered by sums 4 then 5.
```

**Constraints:**
- `1 <= nums1.length, nums2.length <= 1000` for this portable version (the classic allows larger).
- `-10^9 <= nums1[i], nums2[i] <= 10^9`
- Both arrays are sorted in non-decreasing order.
- `1 <= k <= 10^4`
- `k <= nums1.length * nums2.length`

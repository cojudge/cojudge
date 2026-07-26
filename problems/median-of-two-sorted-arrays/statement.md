Given two integer arrays `nums1` and `nums2`, each sorted in nondecreasing order, return the median of all values from both arrays. At least one input array is nonempty.

The required overall running time is `O(log(min(nums1.length, nums2.length)))`.

**Constraints:**

- `0 <= nums1.length, nums2.length <= 1000`
- `1 <= nums1.length + nums2.length <= 2000`
- `-10^6 <= nums1[i], nums2[i] <= 10^6`
- Both arrays are sorted in nondecreasing order.

**Portable interface:** Implement `findMedianSortedArrays(nums1, nums2)`. To avoid language-dependent floating-point formatting, this adaptation returns a canonical decimal string. Return an integral median with `.0` and a half-integer median with `.5`, for example `"2.0"`, `"2.5"`, or `"-0.5"`.

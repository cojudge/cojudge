Two integer arrays `nums1` and `nums2` arrive already ordered from smallest to largest. Conceptually merge their contents and report the middle value, or the mean of the two middle values when the combined size is even. At least one of the two inputs contains an element.

An efficient procedure is expected, with total running time `O(log(min(nums1.length, nums2.length)))`.

**Constraints:**

- `0 <= nums1.length, nums2.length <= 1000`
- `1 <= nums1.length + nums2.length <= 2000`
- `-10^6 <= nums1[i], nums2[i] <= 10^6`
- Both arrays are sorted in nondecreasing order.

**Portable interface:** Provide `findMedianSortedArrays(nums1, nums2)`. Because floating-point rendering varies between languages, this version expresses the answer as a normalized decimal string: a whole-number median ends in `.0` and a halfway median ends in `.5`, such as `"2.0"`, `"2.5"`, or `"-0.5"`.

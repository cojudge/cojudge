Given two integer arrays `nums1` and `nums2` that hold exactly the same multiset of values (the second is a rearrangement of the first), build an index map for the first array into the second.

For every position `i` in `nums1`, pick a position `P[i]` in `nums2` so that the values match: `nums1[i] == nums2[P[i]]`. When a value occurs several times, its copies may be matched to the repeated positions in any order. Return the array `P`.

More than one answer can be valid; any mapping that pairs equal values is accepted.

**Constraints:**
- `1 <= nums1.length == nums2.length <= 100`
- `0 <= nums1[i], nums2[i] <= 10^5`
- `nums2` is a permutation of `nums1`

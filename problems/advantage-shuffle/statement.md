You are given two arrays `nums1` and `nums2` of equal length `n`. You may reorder `nums1` arbitrarily; call the reordered version `ans`.

The advantage of `ans` over `nums2` is the count of positions `i` where `ans[i] > nums2[i]`. Arrange `ans` to make this count as large as possible.

Return any rearrangement of `nums1` achieving the maximum advantage. The checker verifies that your output uses exactly the same multiset as `nums1` and reaches the best achievable count, not that it matches one particular ordering.

**Constraints:**
- `1 <= nums1.length == nums2.length <= 10^5`
- `0 <= nums1[i], nums2[i] <= 10^9`

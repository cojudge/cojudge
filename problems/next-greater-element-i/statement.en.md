For an element `x` inside a list, its next greater element is the first value to the right of `x` that is strictly larger. If no such value exists the answer for `x` is `-1`.

You receive two lists with all distinct entries where every value of `nums1` also occurs somewhere in `nums2`. For each entry of `nums1`, locate its position in `nums2` and report its next greater element within `nums2`. Collect the results in the order of `nums1`.

**Constraints:**
- `1 <= nums1.length <= nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 10^4`
- All values in each list are unique and `nums1` is a subset of `nums2`

For an element `x` inside a list, its next greater element is the first value to the right of `x` that is strictly larger. If no such value exists the answer for `x` is `-1`.

You receive two lists with all distinct entries where every value of `nums1` also occurs somewhere in `nums2`. For each entry of `nums1`, locate its position in `nums2` and report its next greater element within `nums2`. Collect the results in the order of `nums1`.

**Example 1:**
```
Input: nums1 = [4,1,2], nums2 = [1,3,4,2]
Output: [-1,3,-1]
Explanation: 4 has nothing larger to its right; 1 sees 3 next; 2 is last.
```

**Example 2:**
```
Input: nums1 = [2,4], nums2 = [1,2,3,4]
Output: [3,-1]
Explanation: 2 is followed by 3; 4 has no larger successor.
```

**Constraints:**
- `1 <= nums1.length <= nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 10^4`
- All values in each list are unique and `nums1` is a subset of `nums2`

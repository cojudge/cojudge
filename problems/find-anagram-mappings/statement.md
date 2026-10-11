Given two integer arrays `nums1` and `nums2` that hold exactly the same multiset of values (the second is a rearrangement of the first), build an index map for the first array into the second.

For every position `i` in `nums1`, pick a position `P[i]` in `nums2` so that the values match: `nums1[i] == nums2[P[i]]`. When a value occurs several times, its copies may be matched to the repeated positions in any order. Return the array `P`.

More than one answer can be valid; any mapping that pairs equal values is accepted.

**Example 1:**
```
Input: nums1 = [12,28,46,32,50], nums2 = [50,12,32,46,28]
Output: [1,4,3,2,0]
Explanation: nums1[0] = 12 is at nums2[1]; nums1[1] = 28 is at nums2[4]; nums1[2] = 46 is at nums2[3]; nums1[3] = 32 is at nums2[2]; nums1[4] = 50 is at nums2[0]. Other pairings of equal values are also fine.
```

**Example 2:**
```
Input: nums1 = [84,46], nums2 = [84,46]
Output: [0,1]
Explanation: Both entries already line up, so the identity map works.
```

**Example 3:**
```
Input: nums1 = [1,1,2], nums2 = [2,1,1]
Output: [1,2,0]
Explanation: The two 1s in nums1 can take nums2 positions 1 and 2 in either order, and the 2 takes position 0.
```

**Constraints:**
- `1 <= nums1.length == nums2.length <= 100`
- `0 <= nums1[i], nums2[i] <= 10^5`
- `nums2` is a permutation of `nums1`

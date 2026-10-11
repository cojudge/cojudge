You are given two arrays `nums1` and `nums2` of equal length `n`. You may reorder `nums1` arbitrarily; call the reordered version `ans`.

The advantage of `ans` over `nums2` is the count of positions `i` where `ans[i] > nums2[i]`. Arrange `ans` to make this count as large as possible.

Return any rearrangement of `nums1` achieving the maximum advantage. The checker verifies that your output uses exactly the same multiset as `nums1` and reaches the best achievable count, not that it matches one particular ordering.

**Example 1:**
```
Input: nums1 = [2,7,11,15], nums2 = [1,10,4,11]
Output: [2,11,7,15]
Explanation: All four positions beat the opponent, which is optimal.
```

**Example 2:**
```
Input: nums1 = [12,24,8,32], nums2 = [13,25,32,11]
Output: [24,32,8,12]
Explanation: Three positions beat the opponent, which is the best possible here.
```

**Example 3:**
```
Input: nums1 = [1,1], nums2 = [1,1]
Output: [1,1]
Explanation: No position can beat the opponent.
```

**Constraints:**
- `1 <= nums1.length == nums2.length <= 10^5`
- `0 <= nums1[i], nums2[i] <= 10^9`

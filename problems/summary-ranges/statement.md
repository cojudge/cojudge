You are given a sorted array `nums` of distinct integers. Compress every maximal run of consecutive numbers into a short label: a lone value `a` becomes `"a"`, while a run from `a` to `b` (with `b > a`) becomes `"a->b"`.

Return the labels in the order the runs appear.

**Example 1:**
```
Input: nums = [0,1,2,4,5,7]
Output: ["0->2","4->5","7"]
Explanation: 0,1,2 form one run ("0->2"), 4,5 form another ("4->5"), and 7 stands alone.
```

**Example 2:**
```
Input: nums = [0,2,3,4,6,8,9]
Output: ["0","2->4","6","8->9"]
Explanation: 0 and 6 are solitary; 2,3,4 collapse to "2->4" and 8,9 to "8->9".
```

**Example 3:**
```
Input: nums = []
Output: []
Explanation: There are no runs at all.
```

**Constraints:**
- `0 <= nums.length <= 20`
- `-2^31 <= nums[i] <= 2^31 - 1`
- `nums` is sorted in strictly increasing order.

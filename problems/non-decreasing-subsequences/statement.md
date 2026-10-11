You receive a list of integers. A subsequence keeps some elements in their original relative order while possibly skipping others. It is called non-decreasing when each kept value is greater than or equal to the previous kept value.

List every distinct non-decreasing subsequence that uses at least two positions. Two subsequences count as the same when their value sequences match, even if they came from different indices. The order of the returned groups does not matter.

**Example 1:**
```
Input: nums = [4,6,7,7]
Output: [[4,6],[4,6,7],[4,6,7,7],[4,7],[4,7,7],[6,7],[6,7,7],[7,7]]
Explanation: All eight distinct non-decreasing groups with length at least two.
```

**Example 2:**
```
Input: nums = [4,4,3,2,1]
Output: [[4,4]]
Explanation: Only the leading equal pair is non-decreasing.
```

**Adaptation note:** The original signature returns a list of lists; here it maps to `int_list_2d` in this judge.

**Constraints:**
- `1 <= nums.length <= 15`
- `-100 <= nums[i] <= 100`

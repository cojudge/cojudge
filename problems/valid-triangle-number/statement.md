You are given side lengths in an array `nums`. Count how many index triples `i < j < k` could serve as the three sides of a non-degenerate triangle.

Three lengths form a genuine triangle exactly when the sum of any two exceeds the third. After sorting, it suffices to verify that the two shorter sides beat the longest one.

Return the number of valid triples.

**Example 1:**
```
Input: nums = [2,2,3,4]
Output: 3
Explanation: Valid index triples are (0,1,2), (0,2,3) and (1,2,3).
```

**Example 2:**
```
Input: nums = [4,2,3,4]
Output: 4
Explanation: Sorted to [2,3,4,4], four of the five triples pass.
```

**Example 3:**
```
Input: nums = [1,1,1]
Output: 1
```

**Constraints:**
- `1 <= nums.length <= 1000`
- `0 <= nums[i] <= 1000`

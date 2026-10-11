You receive an integer array `nums` and two bounds `left` and `right` with `left <= right`. A contiguous segment of the array is called suitable when the largest value inside it lies between `left` and `right` inclusive.

Count how many non-empty contiguous subarrays are suitable.

**Example 1:**
```
Input: nums = [2,1,4,3], left = 2, right = 3
Output: 3
Explanation: The suitable pieces are [2], [2,1], and [3].
```

**Example 2:**
```
Input: nums = [2,9,2,5,6], left = 2, right = 8
Output: 7
Explanation: Seven subarrays have a maximum strictly above 1 and at most 8.
```

**Example 3:**
```
Input: nums = [1,1,1], left = 1, right = 1
Output: 6
Explanation: Every subarray qualifies, giving 3 * 4 / 2 pieces.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `0 <= nums[i] <= 10^9`
- `0 <= left <= right <= 10^9`

Given an unsorted integer array, look at the array in sorted order and measure the gaps between neighbours. Return the largest such gap.

When the array holds fewer than two numbers there is no gap, so return 0.

**Example 1:**
```
Input: nums = [3,6,9,1]
Output: 3
Explanation: Sorted, the array is [1,3,6,9]. The gaps are 2, 3, 3, so the largest is 3.
```

**Example 2:**
```
Input: nums = [10]
Output: 0
Explanation: A single element has no neighbour gap.
```

**Example 3:**
```
Input: nums = [13,16,19,1]
Output: 12
Explanation: Sorted, the array is [1,13,16,19]. The gaps are 12, 3, 3, so the largest is 12.
```

**Constraints:**
- `0 <= nums.length <= 10^4`
- `0 <= nums[i] <= 10^9`

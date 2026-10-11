You are given a sorted array in which every value occurs exactly twice, except for one value that occurs exactly once. The pairs of equal values sit next to each other.

Locate the lone value and return it. A solution that runs in logarithmic time with constant extra memory is expected.

**Example 1:**
```
Input: nums = [1,1,2,3,3,4,4,8,8]
Output: 2
Explanation: Only 2 appears once; every other value appears twice.
```

**Example 2:**
```
Input: nums = [3,3,7,7,10,11,11]
Output: 10
Explanation: The unpaired entry is 10.
```

**Example 3:**
```
Input: nums = [1]
Output: 1
Explanation: A single-element array is already the answer.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `nums.length` is odd
- `0 <= nums[i] <= 10^5`
- `nums` is sorted in non-decreasing order and all but one value appear twice

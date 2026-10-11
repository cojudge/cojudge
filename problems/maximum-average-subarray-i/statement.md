Given an integer array `nums` and a window length `k`, look at every contiguous block of exactly `k` elements and return the largest block average.

Because averages are fractional, this judge passes them as decimal strings: implement `findMaxAverage(nums, k)` returning a string parseable as a double. An answer is accepted when it sits within `1e-5` of the true maximum average.

**Example 1:**
```
Input: nums = [1,12,-5,-6,50,3], k = 4
Output: "12.75"
Explanation: The block [12,-5,-6,50] sums to 51, averaging 12.75, the best of the three windows.
```

**Example 2:**
```
Input: nums = [5], k = 1
Output: "5.0"
```

**Example 3:**
```
Input: nums = [-1,-2,-3], k = 2
Output: "-1.5"
```

**Constraints:**
- `1 <= k <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
- The output must be a finite decimal string parseable as a double.

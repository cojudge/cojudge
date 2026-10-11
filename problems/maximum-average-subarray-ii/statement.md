Given an integer array `nums` and a minimum length `k`, look at every contiguous block of length at least `k` and return the largest block average.

Because averages are fractional, this judge passes them as decimal strings: implement `findMaxAverage(nums, k)` returning a string parseable as a double. An answer is accepted when it sits within `1e-5` of the true optimum.

**Example 1:**
```
Input: nums = [1,12,-5,-6,50,3], k = 4
Output: "12.75"
Explanation: The length-4 block [12,-5,-6,50] averages 12.75, beating every longer block.
```

**Example 2:**
```
Input: nums = [5], k = 1
Output: "5.0"
```

**Example 3:**
```
Input: nums = [1,2,3,4,5], k = 1
Output: "5.0"
Explanation: With minimum length 1 the best block is the single largest element.
```

**Constraints:**
- `1 <= k <= nums.length <= 10^4`
- `-10^4 <= nums[i] <= 10^4`
- The output must be a finite decimal string parseable as a double.

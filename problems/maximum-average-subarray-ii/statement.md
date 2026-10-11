Given an integer array `nums` and a minimum length `k`, look at every contiguous block of length at least `k` and return the largest block average.

Because averages are fractional, this judge passes them as decimal strings: implement `findMaxAverage(nums, k)` returning a string parseable as a double. An answer is accepted when it sits within `1e-5` of the true optimum.

**Constraints:**
- `1 <= k <= nums.length <= 10^4`
- `-10^4 <= nums[i] <= 10^4`
- The output must be a finite decimal string parseable as a double.

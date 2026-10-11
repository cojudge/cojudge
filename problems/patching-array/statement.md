You start with a sorted array `nums` of positive integers and a target reach `n`. Using any subset of the array's elements (each at most once), you can assemble various totals. If every integer from `1` through `n` can already be formed this way, nothing needs to change. Otherwise you may insert extra numbers ("patches") anywhere in the array. Return the smallest number of patches that makes all values in `[1, n]` representable as subset sums.

**Example 1:**
```
Input: nums = [1,3], n = 6
Output: 1
Explanation: Subset sums of [1,3] cover 1, 3 and 4. Patching in 2 extends coverage to every value 1..6.
```

**Example 2:**
```
Input: nums = [1,5,10], n = 20
Output: 2
Explanation: Patching 2 and then 4 (one workable choice) fills the gaps so that 1..20 all become reachable.
```

**Example 3:**
```
Input: nums = [1,2,2], n = 5
Output: 0
Explanation: Sums of [1,2,2] already produce 1, 2, 3, 4 and 5.
```

**Constraints:**
- `1 <= nums.length <= 1000`
- `1 <= nums[i] <= 10^4`
- `nums` is sorted in non-decreasing order.
- `1 <= n <= 2^31 - 1`

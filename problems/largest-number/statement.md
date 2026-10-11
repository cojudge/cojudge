Given non-negative integers, arrange their order so that gluing them together forms the largest possible number. Return that number as a string.

Comparison is by glued pairs: for two numbers `a` and `b`, place `a` before `b` when `a + b` is larger than `b + a`. When every number is zero, return `"0"` rather than a run of zeros.

**Example 1:**
```
Input: nums = [10,2]
Output: "210"
Explanation: Gluing as "210" beats "102".
```

**Example 2:**
```
Input: nums = [3,30,34,5,9]
Output: "9534330"
Explanation: The order [9,5,34,3,30] gives the largest glued value.
```

**Example 3:**
```
Input: nums = [0,0]
Output: "0"
Explanation: All zeros collapse to a single "0".
```

**Constraints:**
- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 10^9`

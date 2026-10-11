You are given a sorted integer array `nums` plus three coefficients `a`, `b`
and `c`. Apply the quadratic map `f(x) = a*x^2 + b*x + c` to every element,
then return the transformed values in non-decreasing order.

A direct transform breaks the ordering, but the parabola shape lets you refill
the answer from one end: with `a >= 0` the largest values come from the outer
ends, while with `a < 0` the smallest values come from the outer ends.

**Example 1:**
```
Input: nums = [-4,-2,2,4], a = 1, b = 3, c = 5
Output: [3,9,15,33]
Explanation: The raw values are 9, 3, 15 and 33, which sort to [3,9,15,33].
```

**Example 2:**
```
Input: nums = [-4,-2,2,4], a = -1, b = 3, c = 5
Output: [-23,-5,1,7]
Explanation: The raw values are -23, 7, 1 and -5, which sort to [-23,-5,1,7].
```

**Constraints:**
- `1 <= nums.length <= 500`
- `-100 <= nums[i] <= 100`, sorted in non-decreasing order
- `-100 <= a, b, c <= 100`

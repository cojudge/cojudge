Given a positive integer `n`, return every way to write it as a product of integers greater than 1. Each way is a list of at least two factors in non-decreasing order whose product equals `n`. Return the collection of ways in any order.

A single factor such as `[12]` alone is not counted, and factor `1` is never used.

**Example 1:**
```
Input: n = 12
Output: [[2,6],[3,4],[2,2,3]]
Explanation: 12 equals 2 * 6, 3 * 4 and 2 * 2 * 3. No other multiset of factors above 1 multiplies to 12.
```

**Example 2:**
```
Input: n = 37
Output: []
Explanation: 37 is prime, so it cannot be split into smaller factors above 1.
```

**Example 3:**
```
Input: n = 1
Output: []
Explanation: 1 has no factor above 1 to build a combination from.
```

**Constraints:**
- `1 <= n <= 10^7`

You are given a positive integer `n`. You may reorder its decimal digits arbitrarily, but the rearranged number must not have a leading zero.

Determine whether some rearrangement equals a power of two (1, 2, 4, 8, 16, 32, and so on). Return `true` when possible and `false` otherwise.

Only the multiset of digits matters: two numbers with the same digit counts are rearrangements of each other.

**Example 1:**
```
Input: n = 1
Output: true
Explanation: 1 is already a power of two.
```

**Example 2:**
```
Input: n = 10
Output: false
Explanation: The rearrangements are 1 and 10? Actually 01 is invalid, and neither 10 nor 1 with these digits forms a power of two beyond 1 itself which needs a single digit.
```

**Example 3:**
```
Input: n = 16
Output: true
Explanation: 16 itself is a power of two.
```

**Constraints:**
- `1 <= n <= 10^9`

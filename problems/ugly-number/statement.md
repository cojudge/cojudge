An ugly number is a positive integer whose prime factors are only 2, 3 and 5. By convention, 1 has no prime factors and counts as ugly.

Given an integer `n`, return `true` when `n` is ugly and `false` otherwise.

**Example 1:**
```
Input: n = 6
Output: true
Explanation: 6 factors as 2 * 3, using only allowed primes.
```

**Example 2:**
```
Input: n = 1
Output: true
Explanation: 1 has no prime factors, so it is ugly by definition.
```

**Example 3:**
```
Input: n = 14
Output: false
Explanation: 14 includes the prime factor 7, which is not allowed.
```

**Constraints:**
- `-2^31 <= n <= 2^31 - 1`

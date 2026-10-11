A positive integer is called a *super ugly number* when every prime divisor it has appears in a given list `primes`. By convention, `1` counts as a super ugly number since it has no prime divisors at all.

You are given an integer `n` and a strictly increasing array `primes` of prime numbers. Consider all super ugly numbers built from `primes`, sorted from smallest to largest, and return the `n`-th value in that ordering (counting from 1). The answer always fits into a 32-bit signed integer.

**Example 1:**
```
Input: n = 12, primes = [2,7,13,19]
Output: 32
Explanation: The ordered sequence starts [1,2,4,7,8,13,14,16,19,26,28,32], whose 12th entry is 32.
```

**Example 2:**
```
Input: n = 1, primes = [2,3,5]
Output: 1
Explanation: The first super ugly number is always 1, which has no prime factors.
```

**Example 3:**
```
Input: n = 11, primes = [2,3,5]
Output: 15
Explanation: The ordered sequence starts [1,2,3,4,5,6,8,9,10,12,15], whose 11th entry is 15.
```

**Constraints:**
- `1 <= n <= 10^5`
- `1 <= primes.length <= 100`
- `2 <= primes[i] <= 1000`
- Each `primes[i]` is prime, and the values are distinct and sorted increasingly.

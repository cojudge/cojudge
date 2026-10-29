A positive integer is called a *super ugly number* when every prime divisor it has appears in a given list `primes`. By convention, `1` counts as a super ugly number since it has no prime divisors at all.

You are given an integer `n` and a strictly increasing array `primes` of prime numbers. Consider all super ugly numbers built from `primes`, sorted from smallest to largest, and return the `n`-th value in that ordering (counting from 1). The answer always fits into a 32-bit signed integer.

**Constraints:**
- `1 <= n <= 10^5`
- `1 <= primes.length <= 100`
- `2 <= primes[i] <= 1000`
- Each `primes[i]` is prime, and the values are distinct and sorted increasingly.

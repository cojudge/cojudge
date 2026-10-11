Given two integers `left` and `right` with `left <= right`, count how many integers `x` in the closed interval `[left, right]` have a prime number of `1` bits in their binary form.

The bit count of `x` is the number of ones when `x` is written in base two; for instance `21 = 10101` has three such bits.

**Example 1:**
```
Input: left = 6, right = 10
Output: 4
Explanation: 6 (110) has 2 bits, 7 (111) has 3, 8 (1000) has 1, 9 (1001) has 2, 10 (1010) has 2. All except 8 have a prime count, so the answer is 4.
```

**Example 2:**
```
Input: left = 10, right = 15
Output: 5
Explanation: 10 has 2 bits, 11 has 3, 12 has 2, 13 has 3, 14 has 3, 15 has 4. Only 15 misses a prime count.
```

**Example 3:**
```
Input: left = 1, right = 1
Output: 0
Explanation: 1 has a single one-bit, and 1 is not prime.
```

**Constraints:**
- `1 <= left <= right <= 10^6`
- `0 <= right - left <= 10^4`

You are given an integer `n`. A prime palindrome is a number that reads the same forward and backward (in decimal, without leading zeros) and is also prime.

Return the smallest prime palindrome that is greater than or equal to `n`.

Single-digit numbers that are prime (2, 3, 5, 7) already qualify, and two-digit 11 qualifies as well.

**Example 1:**
```
Input: n = 6
Output: 7
Explanation: 6 itself is not prime, and 7 is the next prime palindrome.
```

**Example 2:**
```
Input: n = 8
Output: 11
Explanation: 8, 9 and 10 are not prime palindromes; 11 is.
```

**Example 3:**
```
Input: n = 13
Output: 101
Explanation: No palindrome between 13 and 100 is prime, so 101 is the first.
```

**Constraints:**
- `1 <= n <= 10^8`

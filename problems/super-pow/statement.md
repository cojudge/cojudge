Raise a base to an enormous exponent given digit by digit, then reduce modulo 1337.

You receive an integer `a` and an array `b` whose entries are the decimal digits of a huge exponent (most significant first, no leading zeros). Compute `a` raised to that exponent, modulo `1337`. The exponent can have up to 2000 digits, so it must never be rebuilt as one machine integer; instead fold the digits in one at a time with modular arithmetic.

**Example 1:**
```
Input: a = 2, b = [3]
Output: 8
Explanation: The exponent is 3 and 2^3 = 8.
```

**Example 2:**
```
Input: a = 2, b = [1,0]
Output: 1024
Explanation: The exponent is 10, 2^10 = 1024, and 1024 mod 1337 is 1024.
```

**Example 3:**
```
Input: a = 1, b = [4,3,3,8,5,2]
Output: 1
Explanation: Any power of 1 stays 1.
```

**Constraints:**
- `1 <= a <= 2^31 - 1`
- `1 <= b.length <= 2000`
- `0 <= b[i] <= 9`
- `b` has no leading zeros.

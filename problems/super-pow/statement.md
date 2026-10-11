Raise a base to an enormous exponent given digit by digit, then reduce modulo 1337.

You receive an integer `a` and an array `b` whose entries are the decimal digits of a huge exponent (most significant first, no leading zeros). Compute `a` raised to that exponent, modulo `1337`. The exponent can have up to 2000 digits, so it must never be rebuilt as one machine integer; instead fold the digits in one at a time with modular arithmetic.

**Constraints:**
- `1 <= a <= 2^31 - 1`
- `1 <= b.length <= 2000`
- `0 <= b[i] <= 9`
- `b` has no leading zeros.

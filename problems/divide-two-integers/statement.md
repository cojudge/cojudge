Given a dividend and a divisor, compute the integer quotient of the division, discarding any fractional part (truncation toward zero: `8.345` becomes `8` and `-2.7335` becomes `-2`).

You may not use the multiplication, division, or modulo operators anywhere in your logic.

Because the environment stores only 32-bit signed integers, clamp the result: a quotient above `2^31 - 1` becomes `2147483647`. (This happens only for `-2147483648 / -1`; a quotient below `-2^31` cannot occur.)

**Example 1:**
```
Input: dividend = 10, divisor = 3
Output: 3
Explanation: 10/3 = 3.333..., which truncates to 3.
```

**Example 2:**
```
Input: dividend = 7, divisor = -3
Output: -2
Explanation: 7/-3 = -2.333..., which truncates toward zero to -2.
```

**Constraints:**
- `-2^31 <= dividend, divisor <= 2^31 - 1`
- `divisor != 0`

Given a dividend and a divisor, compute the integer quotient of the division, discarding any fractional part (truncation toward zero: `8.345` becomes `8` and `-2.7335` becomes `-2`).

You may not use the multiplication, division, or modulo operators anywhere in your logic.

Because the environment stores only 32-bit signed integers, clamp the result: a quotient above `2^31 - 1` becomes `2147483647`. (This happens only for `-2147483648 / -1`; a quotient below `-2^31` cannot occur.)

**Constraints:**
- `-2^31 <= dividend, divisor <= 2^31 - 1`
- `divisor != 0`

Implement exponentiation for a decimal base `x` and a 32-bit integer exponent `n`.

Return `x` raised to `n`. Your algorithm should run in `O(log |n|)` time rather than multiplying `|n|` times.

**Portable string adaptation:** The base is supplied as a valid finite decimal string so every supported language receives the same input. Parse `x` as a double-precision floating-point value and return the result as a decimal string that can be parsed as a double. Scientific notation is allowed. Answers are checked with absolute and relative tolerance. `NaN`, infinity, and malformed output strings are rejected.

**Constraints:**
- `-100 < x < 100`
- `-2^31 <= n <= 2^31 - 1`
- Either `x != 0` or `n > 0`
- `-10^4 <= x^n <= 10^4`

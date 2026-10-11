Break a digit string into a Fibonacci-like list.

A list is Fibonacci-like when it holds at least three numbers, every value fits in a signed 32-bit integer, and each number from the third onward equals the sum of the two before it. Additionally, no number may carry a leading zero unless the number itself is exactly zero.

Given a string `num` of digits, split it into such a list using every character exactly once in order. Return any valid split, or an empty list when no split works.

**Constraints:**
- `1 <= num.length <= 200`
- `num` holds only digits.

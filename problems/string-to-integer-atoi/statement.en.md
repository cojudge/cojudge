Convert the leading portion of a string `s` into a 32-bit signed integer, following these steps in order:

1. Skip any blank spaces at the very start of the string.
2. If the next character is `-` or `+`, record the sign (negative or positive) and move past it. When neither sign is present, treat the number as positive.
3. Read consecutive decimal digits and build the numeric value, stopping at the first character that is not a digit (or at the end of the string). Leading zeros are simply part of the value.
4. If no digits were found, the answer is `0`.
5. Clamp the result into the signed 32-bit range `[-2^31, 2^31 - 1]`: values below the minimum become `-2147483648` and values above the maximum become `2147483647`.

Important: implement the digit parsing yourself rather than calling a built-in string-to-number routine.

**Constraints:**
- `0 <= s.length <= 200`
- `s` consists of English letters (upper- and lower-case), decimal digits, `' '`, `'+'`, `'-'`, and `'.'`

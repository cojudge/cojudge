Write the hexadecimal form of a signed 32-bit integer `num`, using lowercase letters.

Non-negative values convert in the usual base-16 way with no leading zeros (except that zero itself becomes `"0"`). Negative values first wrap into their 32-bit two's complement bit pattern and then convert that unsigned pattern the same way. For instance, `-1` has all 32 bits set, giving eight `f` characters.

Do not call a built-in base-conversion helper; build the digits directly.

**Constraints:**
- `-2^31 <= num <= 2^31 - 1`
- Output uses only `0-9` and `a-f`, with no leading zeros unless the value is zero.

Two strings `s` and `t` each describe a decimal number. The format is an integer part, optionally followed by a dot and decimals, where a trailing block in parentheses repeats forever. For instance, `0.(52)` means `0.525252...` and `0.955(72)` means `0.9557272...`. A spelling such as `1.` has no fractional digits.

Decide whether the two spellings name the same numeric value. Note that different spellings can coincide: trailing repeating `9`s round up (`0.9(9)` equals `1.`), and the split between repeating and non-repeating digits is not unique (`0.1666(6)` equals `0.166(66)`).

Return `true` when the values are equal and `false` otherwise.

**Constraints:**
- Each spelling contains digits, at most one `.`, and at most one `(...)` block at the end.
- The repeating block, when present, holds 1 to 4 digits.
- The integer part holds 1 to 3 digits.

Write the hexadecimal form of a signed 32-bit integer `num`, using lowercase letters.

Non-negative values convert in the usual base-16 way with no leading zeros (except that zero itself becomes `"0"`). Negative values first wrap into their 32-bit two's complement bit pattern and then convert that unsigned pattern the same way. For instance, `-1` has all 32 bits set, giving eight `f` characters.

Do not call a built-in base-conversion helper; build the digits directly.

**Example 1:**
```
Input: num = 26
Output: "1a"
Explanation: 26 is one sixteen plus ten, hence digits 1 and a.
```

**Example 2:**
```
Input: num = -1
Output: "ffffffff"
Explanation: The 32-bit pattern for -1 is all ones, which is eight groups of 1111.
```

**Example 3:**
```
Input: num = 0
Output: "0"
```

**Constraints:**
- `-2^31 <= num <= 2^31 - 1`
- Output uses only `0-9` and `a-f`, with no leading zeros unless the value is zero.

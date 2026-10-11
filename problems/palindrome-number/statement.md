Decide whether a given integer `x` reads the same forwards and backwards in its ordinary decimal writing (without extra leading zeros).

A negative value can never qualify, because the minus sign has no counterpart on the right side. Likewise, a non-zero number ending in `0` cannot qualify, since its reversal would begin with `0`.

**Example 1:**
```
Input: x = 121
Output: true
Explanation: 121 is identical when read from either end.
```

**Example 2:**
```
Input: x = -121
Output: false
Explanation: Reading from right to left gives "121-", which differs because of the sign.
```

**Example 3:**
```
Input: x = 10
Output: false
Explanation: Reversed, the digits form "01", which is not the same as "10".
```

**Constraints:**
- `-2^31 <= x <= 2^31 - 1`

**Follow up:** Try to avoid converting the number to a string. As a hint, reversing only half of the digits keeps every intermediate value safely inside 32 bits.

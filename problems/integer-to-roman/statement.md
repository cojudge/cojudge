Seven symbols form the basis of Roman numerals: `I` (1), `V` (5), `X` (10), `L` (50), `C` (100), `D` (500), and `M` (1000). Larger values are written from the biggest place value down to the smallest, using these composition rules:

- Otherwise, repeatedly take the largest symbol value that fits into what remains, append its symbol, and subtract.
- The amounts 4, 9, 40, 90, 400, and 900 use subtractive pairs instead: `IV`, `IX`, `XL`, `XC`, `CD`, and `CM`.
- The symbols `I`, `X`, `C`, and `M` may repeat at most three times in a row; `V`, `L`, and `D` are never repeated.

Given an integer `num`, produce its Roman numeral string.

**Example 1:**
```
Input: num = 3749
Output: "MMMDCCXLIX"
Explanation: 3000 = MMM, 700 = DCC, 40 = XL, and 9 = IX.
```

**Example 2:**
```
Input: num = 58
Output: "LVIII"
Explanation: 50 = L, 5 = V, and 3 = III.
```

**Example 3:**
```
Input: num = 1994
Output: "MCMXCIV"
Explanation: 1000 = M, 900 = CM, 90 = XC, and 4 = IV.
```

**Constraints:**
- `1 <= num <= 3999`

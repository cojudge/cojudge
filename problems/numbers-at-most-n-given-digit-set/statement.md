You own a stamp set holding single non-zero digits, for instance `["1","3","5"]`. By pressing stamps any number of times (repeats allowed) you can compose positive integers such as `13`, `551` or `1351315`; the order of stamps is the order of digits.

Given the sorted unique digit list `digits` and a ceiling `n`, tally how many distinct stamp-built numbers are less than or equal to `n`.

**Example 1:**
```
Input: digits = ["1","3","5","7"], n = 100
Output: 20
Explanation: Four one-digit options plus sixteen two-digit options fit; every three-digit build already exceeds 100.
```

**Example 2:**
```
Input: digits = ["1","4","9"], n = 1000000000
Output: 29523
Explanation: All builds with up to nine digits fit except those above the ceiling; the digit-by-digit walk counts 29523.
```

**Example 3:**
```
Input: digits = ["7"], n = 8
Output: 1
Explanation: Only the number 7 itself qualifies.
```

**Constraints:**
- `1 <= digits.length <= 9`
- `digits[i].length == 1`
- Each entry is a digit from `'1'` to `'9'`, all distinct, sorted increasingly.
- `1 <= n <= 10^9`

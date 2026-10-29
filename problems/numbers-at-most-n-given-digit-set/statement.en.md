You own a stamp set holding single non-zero digits, for instance `["1","3","5"]`. By pressing stamps any number of times (repeats allowed) you can compose positive integers such as `13`, `551` or `1351315`; the order of stamps is the order of digits.

Given the sorted unique digit list `digits` and a ceiling `n`, tally how many distinct stamp-built numbers are less than or equal to `n`.

**Constraints:**
- `1 <= digits.length <= 9`
- `digits[i].length == 1`
- Each entry is a digit from `'1'` to `'9'`, all distinct, sorted increasingly.
- `1 <= n <= 10^9`

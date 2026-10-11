Convert a non-negative integer into its English words form.

Write `numberToWords(num)` that spells out `num` using words for each
three-digit block combined with scale names `Thousand`, `Million`, and
`Billion`. A block that is zero is skipped (except when the whole number
is zero, which is `"Zero"`). Separate words with single spaces and use no
leading or trailing spaces.

**Examples:**
```
Input: num = 123
Output: "One Hundred Twenty Three"
```
```
Input: num = 12345
Output: "Twelve Thousand Three Hundred Forty Five"
```
```
Input: num = 0
Output: "Zero"
```

**Constraints:**
- `0 <= num <= 2^31 - 1`

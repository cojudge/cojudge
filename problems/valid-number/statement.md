Decide whether a string represents a valid decimal number. A valid value may include leading and trailing blanks, an optional `+`/`-` sign, digits with at most one decimal point, and an optional exponent part.

The exponent, when present, starts with `e` or `E`, optionally followed by a sign, and must end with at least one digit. The base before the exponent must contain at least one digit, either before or after the point. Blanks are allowed only at the very start or end.

**Example 1:**
```
Input: s = "0"
Output: true
Explanation: A single digit is a valid integer.
```

**Example 2:**
```
Input: s = "e"
Output: false
Explanation: An exponent marker alone has no base digits and no exponent digits.
```

**Example 3:**
```
Input: s = "2e10"
Output: true
Explanation: Base 2 followed by exponent 10 is well formed.
```

**Constraints:**
- `1 <= s.length <= 20`
- `s` consists of digits, signs, points, exponents, and spaces.

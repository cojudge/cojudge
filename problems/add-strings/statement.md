Two non-negative integers arrive as decimal strings `num1` and `num2`. They may be long, so converting the whole strings to integers (or relying on big-integer helpers) is not allowed.

Add them digit by digit and return the total, also as a decimal string without extra leading zeros (except `"0"` itself).

**Example 1:**
```
Input: num1 = "11", num2 = "123"
Output: "134"
```

**Example 2:**
```
Input: num1 = "456", num2 = "77"
Output: "533"
```

**Example 3:**
```
Input: num1 = "0", num2 = "0"
Output: "0"
```

**Constraints:**
- `1 <= num1.length, num2.length <= 10^4`
- Strings hold only digits `0-9` with no leading zeros except for `"0"` itself.

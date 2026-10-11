Generate every strobogrammatic number of length `n`: a string of `n` digits that reads the same after a 180-degree rotation. Valid rotations are `0 -> 0`, `1 -> 1`, `6 -> 9`, `8 -> 8`, and `9 -> 6`.

Numbers must not have a leading zero, except that the single-digit number `"0"` itself is allowed.

Return all such numbers in any order.

*Type note:* the original signature returns a list of strings; here it maps to `string_list`.

**Example 1:**
```
Input: n = 2
Output: ["11","69","88","96"]
Explanation: These are all length-2 strings whose rotation mirrors correctly with a non-zero lead.
```

**Example 2:**
```
Input: n = 1
Output: ["0","1","8"]
Explanation: Only 0, 1, and 8 rotate to themselves as single digits.
```

**Constraints:**
- `1 <= n <= 14`

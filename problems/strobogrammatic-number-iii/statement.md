A strobogrammatic number reads the same after a 180-degree rotation, using the digit pairs `0 -> 0`, `1 -> 1`, `6 -> 9`, `8 -> 8`, and `9 -> 6`.

Given numeric strings `low` and `high` (neither has leading zeros except the number `"0"` itself), count how many strobogrammatic numbers `x` satisfy `low <= x <= high` in numeric value. Numbers of different lengths compare by length first.

Return that count.

**Example 1:**
```
Input: low = "50", high = "100"
Output: 3
Explanation: The qualifying numbers are 69, 88, and 96.
```

**Example 2:**
```
Input: low = "0", high = "0"
Output: 1
Explanation: Zero itself is strobogrammatic.
```

**Constraints:**
- `1 <= low.length, high.length <= 15`
- `low` and `high` hold digits only, with no leading zeros except `"0"`.
- The numeric value of `low` does not exceed that of `high`.

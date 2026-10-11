A tower of champagne glasses is stacked so that row `r` holds `r + 1` glasses. You pour `poured` cups into the top glass. Each glass holds at most one cup; any surplus splits evenly to the two glasses directly below it (half to the lower-left, half to the lower-right). The pouring happens all at once and the liquid keeps flowing downward through full glasses.

Given `query_row` and `query_glass`, report how full that particular glass ends up, capped at one. Because this judge avoids binary floating types, return the amount as a decimal string such as `"0.5"` or `"1.0"`; answers within a tiny tolerance are accepted.

**Example 1:**
```
Input: poured = 1, query_row = 1, query_glass = 1
Output: "0.0"
Explanation: One cup fills only the top glass, so the second row stays empty.
```

**Example 2:**
```
Input: poured = 2, query_row = 1, query_glass = 1
Output: "0.5"
Explanation: The top overflows by one cup, sending half a cup to each glass below.
```

**Example 3:**
```
Input: poured = 4, query_row = 2, query_glass = 1
Output: "0.5"
Explanation: Flow propagates two levels, leaving half a cup in the middle glass of row 2.
```

**Constraints:**
- `0 <= poured <= 10^9`
- `0 <= query_row < 100`
- `0 <= query_glass <= query_row`
- This is a portable adaptation: the floating answer is exchanged as a decimal string with tolerance 1e-9 absolute plus 1e-5 relative.

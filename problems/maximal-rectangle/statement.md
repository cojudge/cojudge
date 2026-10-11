Given a binary grid written with the characters `'0'` and `'1'`, find the area of the largest axis-aligned rectangle that contains only `'1'` cells.

Treat each row as the base of a histogram whose bar heights count consecutive `'1'`s above (including the current row), then measure the biggest rectangle inside that histogram. The best value across all rows is the answer.

> **Adaptation note:** the original LeetCode signature uses `char[][]`. This problem uses the portable `char_array_2d` type, which carries rows of single-character strings such as `[["1","0"],["0","1"]]`. Values are still only `"0"` and `"1"`.

**Example 1:**
```
Input: matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
Output: 6
Explanation: The 2x3 block of 1s in rows 2-3 (0-based rows 1-2), columns 1-3 has area 6.
```

**Example 2:**
```
Input: matrix = [["0"]]
Output: 0
Explanation: With no 1s, no rectangle exists.
```

**Example 3:**
```
Input: matrix = [["1"]]
Output: 1
Explanation: The single cell forms a 1x1 rectangle.
```

**Constraints:**
- `1 <= matrix.length <= 200`
- `1 <= matrix[0].length <= 200`
- Each entry is `"0"` or `"1"`.

Given a string `s` and a positive integer `numRows`, arrange the characters of `s` in a zigzag across `numRows` rows, then read the rows from top to bottom, left to right.

To picture the ordering, write the characters diagonally down and then diagonally up, repeating: move down one row at a time until the bottom row, then move up one row at a time until the top row, and repeat. Characters that land in the same row keep their original left-to-right order.

Return the string obtained by concatenating the rows in order.

**Example 1:**
```
Input: s = "PAYPALISHIRING", numRows = 3
Output: "PAHNAPLSIIGYIR"
Explanation: The layout is:
P   A   H   N
A P L S I I G
Y   I   R
Reading each row gives "PAHN", "APLSIIG" and "YIR".
```

**Example 2:**
```
Input: s = "PAYPALISHIRING", numRows = 4
Output: "PINALSIGYAHRPI"
Explanation: The layout is:
P     I    N
A   L S  I G
Y A   H R
P     I
```

**Example 3:**
```
Input: s = "A", numRows = 1
Output: "A"
```

**Constraints:**
- `1 <= s.length <= 1000`
- `s` consists of English letters, `,` and `.`
- `1 <= numRows <= 1000`

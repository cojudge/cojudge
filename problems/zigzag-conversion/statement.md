Given a string `s` and a positive integer `numRows`, arrange the characters of `s` in a zigzag across `numRows` rows, then read the rows from top to bottom, left to right.

To picture the ordering, write the characters diagonally down and then diagonally up, repeating: move down one row at a time until the bottom row, then move up one row at a time until the top row, and repeat. Characters that land in the same row keep their original left-to-right order.

Return the string obtained by concatenating the rows in order.

**Constraints:**
- `1 <= s.length <= 1000`
- `s` consists of English letters, `,` and `.`
- `1 <= numRows <= 1000`

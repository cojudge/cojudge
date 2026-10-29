A screen has `rows` rows and `cols` columns. Words from `sentence` are written left to right, top to bottom, in order, repeating the sentence as needed. A single space separates consecutive words, words never break across lines, and trailing spaces at a row end do not count against the width.

For example, with `cols = 8` the row `hello___` (hello plus three spaces) is fine, but `hello_w` would overflow.

Count how many complete copies of `sentence` fit on the whole screen.

**Constraints:**
- `1 <= sentence.length <= 100`
- `1 <= sentence[i].length <= 10`
- Words hold lowercase letters.
- `1 <= rows, cols <= 20000`
- Every word fits alone in a row (`sentence[i].length <= cols`).

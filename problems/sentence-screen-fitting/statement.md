A screen has `rows` rows and `cols` columns. Words from `sentence` are written left to right, top to bottom, in order, repeating the sentence as needed. A single space separates consecutive words, words never break across lines, and trailing spaces at a row end do not count against the width.

For example, with `cols = 8` the row `hello___` (hello plus three spaces) is fine, but `hello_w` would overflow.

Count how many complete copies of `sentence` fit on the whole screen.

**Example 1:**
```
Input: sentence = ["hello","world"], rows = 2, cols = 8
Output: 1
Explanation: Row one holds hello, row two holds world; together they form one sentence.
```

**Example 2:**
```
Input: sentence = ["a","bcd","e"], rows = 3, cols = 6
Output: 2
Explanation: The rows pack a-bcd-, e-a-bc-, d-e repetitions to complete the cycle twice.
```

**Example 3:**
```
Input: sentence = ["i","had","apple","pie"], rows = 4, cols = 5
Output: 1
Explanation: Four short rows i, had, apple and pie combine into one full pass.
```

**Constraints:**
- `1 <= sentence.length <= 100`
- `1 <= sentence[i].length <= 10`
- Words hold lowercase letters.
- `1 <= rows, cols <= 20000`
- Every word fits alone in a row (`sentence[i].length <= cols`).

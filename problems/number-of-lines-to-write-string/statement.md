You are given `widths`, an array of 26 positive widths for the letters `a` through `z`, and a string `s` of lowercase letters. Writing lays characters left to right on lines that each hold at most 100 units. A character is placed on the current line when it fits; otherwise a fresh line is started and the character goes there.

Return a two-element array `[totalLines, lastLineWidth]`: the number of lines used and the occupied width of the final line.

**Constraints:**
- `widths.length == 26`
- `2 <= widths[i] <= 10`
- `1 <= s.length <= 1000`
- `s` contains only lowercase English letters

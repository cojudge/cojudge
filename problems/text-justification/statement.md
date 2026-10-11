Spread a list of words across fully justified lines of exactly `maxWidth` characters. Pack as many words as possible into each line, then distribute blanks so the line reaches the required width.

For every line except the last, pad the gaps between words as evenly as possible, giving leftover single spaces to the leftmost gaps first. A line holding only one word is left-aligned with trailing blanks. The final line is left-aligned with single spaces between words and trailing blanks to fill the width.

**Constraints:**
- `1 <= words.length <= 300`
- `1 <= words[i].length <= 20`
- `1 <= maxWidth <= 100`
- Each word contains letters and symbols without spaces.

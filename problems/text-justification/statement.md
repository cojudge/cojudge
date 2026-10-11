Spread a list of words across fully justified lines of exactly `maxWidth` characters. Pack as many words as possible into each line, then distribute blanks so the line reaches the required width.

For every line except the last, pad the gaps between words as evenly as possible, giving leftover single spaces to the leftmost gaps first. A line holding only one word is left-aligned with trailing blanks. The final line is left-aligned with single spaces between words and trailing blanks to fill the width.

**Example 1:**
```
Input: words = ["This","is","an","example","of","text","justification."], maxWidth = 16
Output: ["This    is    an","example  of text","justification.  "]
Explanation: The first two lines spread extra blanks across gaps; the last line is left-aligned.
```

**Example 2:**
```
Input: words = ["What","must","be","acknowledgment","shall","be"], maxWidth = 16
Output: ["What   must   be","acknowledgment  ","shall be        "]
Explanation: The long word fills its own line with trailing blanks.
```

**Example 3:**
```
Input: words = ["Science","is","what","we","understand","well","enough","to","explain","to","a","computer.","Art","is","everything","else","we","do"], maxWidth = 20
Output: ["Science  is  what we","understand      well","enough to explain to","a  computer.  Art is","everything  else  we","do                  "]
Explanation: Each packed line is stretched to width 20 except the last, which is left-aligned.
```

**Constraints:**
- `1 <= words.length <= 300`
- `1 <= words[i].length <= 20`
- `1 <= maxWidth <= 100`
- Each word contains letters and symbols without spaces.

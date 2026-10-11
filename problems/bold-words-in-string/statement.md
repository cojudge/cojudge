You are given keyword list `words` and a text string `s`, both using lowercase letters.

Mark every occurrence of any keyword inside `s`, including overlaps. Then merge all marked spans that overlap or touch edge to edge into the fewest possible groups. Wrap each group with an opening tag `<b>` and a closing tag `</b>`, leaving unmarked parts untouched.

Return the tagged string.

**Constraints:**
- `1 <= s.length <= 500`
- `0 <= words.length <= 50`
- `1 <= words[i].length <= 10`
- `s` and each word hold lowercase English letters.

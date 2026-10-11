You are given keyword list `words` and a text string `s`, both using lowercase letters.

Mark every occurrence of any keyword inside `s`, including overlaps. Then merge all marked spans that overlap or touch edge to edge into the fewest possible groups. Wrap each group with an opening tag `<b>` and a closing tag `</b>`, leaving unmarked parts untouched.

Return the tagged string.

**Example 1:**
```
Input: words = ["ab","bc"], s = "aabcd"
Output: "a<b>abc</b>d"
Explanation: "ab" appears at index 1 and "bc" at index 2; their spans join into indices 1-3, so one tag pair covers "abc".
```

**Example 2:**
```
Input: words = ["ab","cb"], s = "aabcd"
Output: "a<b>ab</b>cd"
Explanation: Only "ab" at index 1 matches, so indices 1-2 form a lone bold group.
```

**Constraints:**
- `1 <= s.length <= 500`
- `0 <= words.length <= 50`
- `1 <= words[i].length <= 10`
- `s` and each word hold lowercase English letters.

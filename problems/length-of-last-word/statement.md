You are given a string `s` built from words separated by spaces. A *word* is a maximal run of non-space characters.

Return how many characters the final word contains. The input always holds at least one word, though it may be padded with extra spaces on either side or between words.

**Example 1:**
```
Input: s = "Hello World"
Output: 5
Explanation: The last word is "World", which has 5 letters.
```

**Example 2:**
```
Input: s = "   fly me   to   the moon  "
Output: 4
Explanation: The last word is "moon" with length 4; surrounding spaces are ignored.
```

**Example 3:**
```
Input: s = "luffy is still joyboy"
Output: 6
Explanation: The last word is "joyboy", which has 6 letters.
```

**Constraints:**
- `1 <= s.length <= 10^4`
- `s` consists only of English letters and spaces `' '`.
- `s` contains at least one word.

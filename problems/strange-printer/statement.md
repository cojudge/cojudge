A printer paints a string one turn at a time. In a turn it chooses a group of positions (not necessarily adjacent after earlier paints) and overwrites them with a single letter. Later turns may overwrite earlier paint.

Given `s`, return the fewest turns needed to paint it starting from a blank page.

**Example 1:**
```
Input: s = "aaabbb"
Output: 2
Explanation: Paint aaabbb as aaaaaa, then repaint the tail as b.
```

**Example 2:**
```
Input: s = "aba"
Output: 2
Explanation: Paint aaa, then paint the middle b.
```

**Example 3:**
```
Input: s = "abc"
Output: 3
Explanation: Three different letters need three turns.
```

**Constraints:**
- `1 <= s.length <= 100`
- `s` holds lowercase English letters.

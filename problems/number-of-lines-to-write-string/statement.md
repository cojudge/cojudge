You are given `widths`, an array of 26 positive widths for the letters `a` through `z`, and a string `s` of lowercase letters. Writing lays characters left to right on lines that each hold at most 100 units. A character is placed on the current line when it fits; otherwise a fresh line is started and the character goes there.

Return a two-element array `[totalLines, lastLineWidth]`: the number of lines used and the occupied width of the final line.

**Example 1:**
```
Input: widths = [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10], s = "abcdefghijklmnopqrstuvwxyz"
Output: [3,60]
Explanation: The 26 letters at width 10 fill two full lines plus 60 units of a third.
```

**Example 2:**
```
Input: widths = [4,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10], s = "bbbcccdddaaa"
Output: [2,4]
Explanation: The first line holds 100 units and the leftover a occupies 4 units.
```

**Example 3:**
```
Input: widths = [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10], s = "a"
Output: [1,10]
Explanation: One letter uses one line of width 10.
```

**Constraints:**
- `widths.length == 26`
- `2 <= widths[i] <= 10`
- `1 <= s.length <= 1000`
- `s` contains only lowercase English letters

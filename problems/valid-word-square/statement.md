You are handed a sequence of words `words`. Imagine stacking them as rows of a rectangle: the first word forms row 0, the second forms row 1, and so on. Such a stacking counts as a square layout when two requirements hold: the number of rows equals the length of the first word, and reading down column `c` spells exactly the word in row `c` for every valid `c`.

In other words, for every pair of positions `(i, j)` that falls inside the layout, the character at row `i`, column `j` must match the character at row `j`, column `i`. Rows may have different lengths; if either side of a compared pair is missing, the layout is invalid unless both sides are missing.

Return `true` when `words` forms such a layout, otherwise `false`.

**Example 1:**
```
Input: words = ["abcd","bnrt","crmy","dtye"]
Output: true
Explanation: Row 0 reads "abcd" and column 0 reads "abcd"; the same agreement holds for the other three positions.
```

**Example 2:**
```
Input: words = ["ball","area","read","lady"]
Output: false
Explanation: Column 3 spells "dly?" while row 3 is "lady", so the symmetry breaks.
```

**Example 3:**
```
Input: words = ["abcd","bnrt","crm","dt"]
Output: true
Explanation: The shorter trailing rows still mirror their columns wherever characters exist.
```

**Constraints:**
- `1 <= words.length <= 500`
- `1 <= words[i].length <= 500`
- `words[i]` holds only lowercase English letters.
- All words together hold at most `250000` characters.

Adaptation: the source signature takes a list of strings; here it is modeled as `string_array` (`String[]`) so every supported language runner can feed it directly.

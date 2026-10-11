American keyboards group letters into three rows: the top row holds `qwertyuiop`, the middle row holds `asdfghjkl`, and the bottom row holds `zxcvbnm`. Letter case does not matter for this task.

Given a list of words, keep only those whose letters all come from a single row. Return the kept words in their original order.

**Example 1:**
```
Input: words = ["Hello","Alaska","Dad","Peace"]
Output: ["Alaska","Dad"]
Explanation: Alaska uses only the middle row and Dad uses only the middle row; the other two mix rows.
```

**Example 2:**
```
Input: words = ["omk"]
Output: []
Explanation: The letters span at least two rows.
```

**Example 3:**
```
Input: words = ["adsdf","sfd"]
Output: ["adsdf","sfd"]
Explanation: Both words stay within the middle row.
```

**Adaptation note:** The list result maps to `string_list` in this judge.

**Constraints:**
- `1 <= words.length <= 20`
- `1 <= words[i].length <= 100`
- Words contain only English letters

You are given a text `s` and a list of keywords `dict`. Every slice of `s` that equals one of the keywords must appear bold in the answer.

Marking works character by character: a character is bold when it belongs to at least one keyword occurrence (overlapping occurrences all count, and searching continues from each next index so overlaps are found). Neighboring or overlapping bold characters fuse into a single run. Wrap each maximal bold run with an opening `<b>` and a closing `</b>` tag, leaving other characters untouched.

Return the tagged string. If no keyword occurs, return `s` unchanged.

**Example 1:**
```
Input: s = "abcxyz123", dict = ["abc","123"]
Output: "<b>abc</b>xyz<b>123</b>"
```

**Example 2:**
```
Input: s = "aaabbcc", dict = ["aaa","aab","bc"]
Output: "<b>aaabbc</b>c"
Explanation: The three matches cover indices 0..5 continuously.
```

**Example 3:**
```
Input: s = "abc", dict = ["xyz"]
Output: "abc"
```

**Constraints:**
- `s` and each keyword hold lowercase letters (and digits in tests here).
- Lengths are small enough for direct scanning.

*Adaptation: the keyword list maps to `string_array` in this judge.*

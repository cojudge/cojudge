Your friend typed a name but some keys may have stuck, repeating characters. Given the intended `name` and the actually typed string `typed`, decide whether the typed string could have come from the intended name by holding some keys longer.

In other words, scanning from left to right, each character of `name` must appear in `typed` in order, and any extra characters in `typed` must equal the previous character of `typed` (a long press). Every character of `typed` must be explainable this way.

Return `true` when `typed` is a valid long-pressed version of `name`, otherwise `false`.

**Example 1:**
```
Input: name = "alex", typed = "aaleex"
Output: true
Explanation: The letters 'a' and 'e' were held a little longer.
```

**Example 2:**
```
Input: name = "saeed", typed = "ssaaedd"
Output: false
Explanation: The count of 'e' does not line up; one 'e' in the typed text cannot produce two in the name.
```

**Example 3:**
```
Input: name = "leelee", typed = "lleeelee"
Output: true
```

**Constraints:**
- `1 <= name.length, typed.length <= 1000`
- Both strings contain only lowercase English letters.

Check whether the sentence `s` follows the letter pattern.

Each letter in `pattern` must map to exactly one distinct word in `s` and
each word to exactly one letter (a bijection). Words in `s` are separated by
single spaces with no leading or trailing gaps. Implement
`wordPattern(pattern, s)` returning true on a full match.

**Examples:**
```
Input: pattern = "abba", s = "dog cat cat dog"
Output: true
```
```
Input: pattern = "abba", s = "dog cat cat fish"
Output: false
```
```
Input: pattern = "aaaa", s = "dog cat cat dog"
Output: false
```

**Constraints:**
- `1 <= pattern.length <= 300`, lowercase letters.
- `1 <= s.length <= 3000`, lowercase letters and single spaces.

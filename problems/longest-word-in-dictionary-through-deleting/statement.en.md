You are given a string `s` and a list of candidate words called `dictionary`. By deleting zero or more characters from `s` (keeping the order of the remaining characters), you can form new strings. Among the dictionary words that can be formed this way, return the longest one. If several candidates share the maximum length, return the one that comes first alphabetically (lexicographically smallest).

It is guaranteed that at least one dictionary word can be formed from `s`.

**Constraints:**
- `1 <= s.length <= 1000`
- `1 <= dictionary.length <= 1000`
- `1 <= dictionary[i].length <= 1000`
- `s` and every dictionary word contain only lowercase English letters.
- At least one dictionary word is a subsequence of `s`.

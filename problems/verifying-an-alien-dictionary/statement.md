In an alien language, they use English lowercase letters but possibly in a different order. The order of the alphabet is some permutation given by `order`.

Given a sequence of words written in the alien language, and the order of the alphabet, return `true` if and only if the given words are sorted lexicographically in this alien language.

**Example 1:**
```
Input: words = ["hello","leetcode"], order = "hlabcdefgijkmnopqrstuvwxyz"
Output: true
```

**Example 2:**
```
Input: words = ["word","world","row"], order = "worldabcefghijkmnpqstuvxyz"
Output: false
```

**Example 3:**
```
Input: words = ["apple","app"], order = "abcdefghijklmnopqrstuvwxyz"
Output: false
```

**Constraints:**
- `1 <= words.length <= 100`
- `1 <= words[i].length <= 20`
- `order.length == 26`
- All characters in `words[i]` and `order` are English lowercase letters

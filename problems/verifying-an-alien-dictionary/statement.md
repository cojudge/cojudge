Suppose a foreign tongue writes with the usual English lowercase letters, yet arranges its alphabet in a different sequence captured by the permutation string `order`.

You are handed a list `words` written in that tongue. Return `true` exactly when the list advances in non-decreasing dictionary sequence under the foreign alphabet ordering, and `false` otherwise. In particular, whenever one entry forms a prefix of the following entry, the shorter entry is required to come first.

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

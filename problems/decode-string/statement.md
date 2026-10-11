You receive a compressed string and must restore its expanded form.

Compression follows the pattern `k[encoded_string]`: the bracketed segment is written out consecutively exactly `k` times, where `k` is a positive integer.

Treat every input as correctly formed: there is no stray spacing, all brackets pair up properly, the payload before expansion holds no digits, and digits appear solely as those repetition counts `k`.

**Example 1:**
```
Input: s = "3[a]2[bc]"
Output: "aaabcbc"
```

**Example 2:**
```
Input: s = "3[a2[c]]"
Output: "accaccacc"
```

**Example 3:**
```
Input: s = "2[abc]3[cd]ef"
Output: "abcabccdcdcdef"
```

**Constraints:**
- `1 <= s.length <= 30`
- `s` consists of lowercase English letters, digits, and square brackets `[]`.
- `s` is guaranteed to be a valid input.
- All the integers in `s` are in the range `[1, 300]`.
- The length of the output will never exceed `10^5`.

You are given a string `s` of lowercase letters. Encode it with the shortest possible length using the form `k[pattern]`, where `pattern` is an encoded string and `k` is a positive integer meaning the pattern repeats `k` times. Encodings may nest, e.g. `2[a3[b]]` expands to `"abbbabbb"`.

Encoding a slice is worthwhile only when the `k[...]` form is strictly shorter than the slice itself; otherwise keep the slice as is. If several encodings tie for the shortest length, any of them is acceptable.

Return an encoding of the whole string with the minimum possible length.

**Example 1:**
```
Input: s = "aaa"
Output: "aaa"
Explanation: Encoding as "3[a]" would be longer (4 vs 3), so the original string stays.
```

**Example 2:**
```
Input: s = "aaaaa"
Output: "5[a]"
Explanation: Five copies of "a" compress to "5[a]".
```

**Example 3:**
```
Input: s = "ababab"
Output: "3[ab]"
Explanation: Three copies of "ab" compress to "3[ab]".
```

**Example 4:**
```
Input: s = "abbbabbbcabbbabbbc"
Output: "2[2[abbb]c]"
Explanation: The inner block "abbbabbbc" first compresses to "2[abbb]c", and doubling it gives the shortest form.
```

**Constraints:**
- `1 <= s.length <= 150`
- `s` consists of lowercase English letters.

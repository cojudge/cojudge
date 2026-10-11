You are given a string `s` of lowercase letters. Encode it with the shortest possible length using the form `k[pattern]`, where `pattern` is an encoded string and `k` is a positive integer meaning the pattern repeats `k` times. Encodings may nest, e.g. `2[a3[b]]` expands to `"abbbabbb"`.

Encoding a slice is worthwhile only when the `k[...]` form is strictly shorter than the slice itself; otherwise keep the slice as is. If several encodings tie for the shortest length, any of them is acceptable.

Return an encoding of the whole string with the minimum possible length.

**Constraints:**
- `1 <= s.length <= 150`
- `s` consists of lowercase English letters.

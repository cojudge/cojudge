Build the shortest string `s` such that every entry of `words` appears in `s` as a suffix of a `#`-terminated block. In other words, `s` is a concatenation of pieces `word + "#"`, and each input word must equal the tail of at least one piece (ignoring the `#`).

If one word is the ending of another, the shorter one comes for free. For example, `["me","time"]` needs only `"time#"` of length 5.

Return the minimum possible length of `s`.

**Constraints:**
- `1 <= words.length <= 2000`
- `1 <= words[i].length <= 7`
- Each word holds lowercase English letters.

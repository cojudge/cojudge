Build the shortest string `s` such that every entry of `words` appears in `s` as a suffix of a `#`-terminated block. In other words, `s` is a concatenation of pieces `word + "#"`, and each input word must equal the tail of at least one piece (ignoring the `#`).

If one word is the ending of another, the shorter one comes for free. For example, `["me","time"]` needs only `"time#"` of length 5.

Return the minimum possible length of `s`.

**Example 1:**
```
Input: words = ["time","me","bell"]
Output: 10
Explanation: "time#bell#" covers all three words and is the shortest possible.
```

**Example 2:**
```
Input: words = ["t"]
Output: 2
Explanation: "t#" is the only encoding.
```

**Example 3:**
```
Input: words = ["me","time"]
Output: 5
Explanation: "time#" already ends with "me#"-style suffix "me", so one block suffices.
```

**Constraints:**
- `1 <= words.length <= 2000`
- `1 <= words[i].length <= 7`
- Each word holds lowercase English letters.

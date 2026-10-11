You are given a string `s` plus a list of strings `wordDict`. Place blanks into `s` so that it becomes a blank-separated sentence in which every token shows up in `wordDict`, and gather every distinct sentence obtainable this way. Return the whole collection in any sequence.

A single dictionary entry may be drawn on repeatedly inside one sentence.

**Constraints:**

- `1 <= s.length <= 20`
- `1 <= wordDict.length <= 1000`
- `1 <= wordDict[i].length <= 10`
- `s` and `wordDict[i]` consist of only lowercase English letters.
- All the strings of `wordDict` are **unique**.
- Input is generated in a way that the length of the answer doesn't exceed 10^5.

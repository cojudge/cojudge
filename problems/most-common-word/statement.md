Given a paragraph and a list of banned words, return the most frequent word that is not banned. Compare words case-insensitively and treat punctuation as separators: `Bob`, `bob!` and `BOB` are the same word `bob`.

Split the paragraph into lowercase letter sequences, discard any word appearing in `banned`, and pick the remaining word with the largest frequency. Exactly one such word has the top count in every test.

**Example 1:**
```
Input: paragraph = "Bob hit a ball, the hit BALL flew far after it was hit.", banned = ["hit"]
Output: "ball"
Explanation: ball occurs twice; no other kept word tops that.
```

**Example 2:**
```
Input: paragraph = "a.", banned = []
Output: "a"
Explanation: Punctuation is stripped, leaving one word.
```

**Example 3:**
```
Input: paragraph = "a, a, a, b,b,b,c, c", banned = ["a"]
Output: "b"
Explanation: Ignoring a, b beats c three to two.
```

**Constraints:**
- `1 <= paragraph.length <= 1000`
- Paragraph holds letters, spaces and punctuation `!?',;.`
- `0 <= banned.length <= 100`
- Each banned word is lowercase letters, all distinct.
- At least one non-banned word exists and the answer is unique.

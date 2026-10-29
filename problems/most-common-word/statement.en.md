Given a paragraph and a list of banned words, return the most frequent word that is not banned. Compare words case-insensitively and treat punctuation as separators: `Bob`, `bob!` and `BOB` are the same word `bob`.

Split the paragraph into lowercase letter sequences, discard any word appearing in `banned`, and pick the remaining word with the largest frequency. Exactly one such word has the top count in every test.

**Constraints:**
- `1 <= paragraph.length <= 1000`
- Paragraph holds letters, spaces and punctuation `!?',;.`
- `0 <= banned.length <= 100`
- Each banned word is lowercase letters, all distinct.
- At least one non-banned word exists and the answer is unique.

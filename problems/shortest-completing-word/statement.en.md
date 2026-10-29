You are given a license plate string `licensePlate` and a list of lowercase candidate words `words`. Exactly one answer is guaranteed to exist.

Collect every letter appearing in the plate while skipping digits, spaces, and punctuation, treating upper and lower case as the same. A candidate is acceptable when it holds each required letter at least as many times as the plate does.

Return the shortest acceptable candidate. If several share the minimal length, return the one appearing earliest in `words`.

**Constraints:**
- `1 <= licensePlate.length <= 7`
- `licensePlate` holds digits, letters, or spaces.
- `1 <= words.length <= 1000`
- `1 <= words[i].length <= 15`
- `words[i]` holds lowercase English letters.

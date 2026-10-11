An abbreviation replaces blocks of letters with their lengths: for example, `w3d` could stand for a four-letter word starting with `w` and ending with `d` with three letters skipped in between.

Given a dictionary word `word` and a candidate shorthand `abbr` (letters and digits), decide whether `abbr` correctly abbreviates `word`. Read digits as a skipped count: leading zeros are forbidden (so `01` or `0` as a skip is invalid), and each skipped block must match that many characters. Plain letters must match exactly.

Return `true` when the whole shorthand consumes the whole word, otherwise `false`.

**Constraints:**
- `1 <= word.length <= 20`
- `1 <= abbr.length <= 20`
- `word` holds lowercase letters; `abbr` holds lowercase letters and digits.

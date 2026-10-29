Decide whether query words have unique abbreviations against a dictionary.

Abbreviate a word as its first letter, then the count of middle letters,
then its last letter (for example `deer` becomes `d2r`); words of length 2
or less abbreviate to themselves. A query is unique when no dictionary word
shares its abbreviation, or every dictionary word sharing it equals the
query itself.

**Adaptation:** instead of a `ValidWordAbbr` class with `isUnique`, implement
`checkAbbr(dictionary, words)` returning an array with `1` for unique and
`0` otherwise, one entry per query.

**Constraints:**
- `1 <= dictionary.length, words.length <= 100`
- Words are lowercase letters.

You are handed a string `s` indexed from `0` alongside a word list `dictionary`. Split `s` into one or more chunks that do not overlap, where every kept chunk must show up verbatim in `dictionary`. Characters of `s` that fall outside all kept chunks count as leftover.

Arrange the split so that the total count of leftover characters is as small as possible, and report that minimum.

**Constraints:**

- `1 <= s.length <= 50`
- `1 <= dictionary.length <= 50`
- `1 <= dictionary[i].length <= 50`
- `dictionary[i]` and `s` consist of only lowercase English letters.
- `dictionary` holds distinct words.

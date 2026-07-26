Given a string `s` and a pattern `p`, implement regular expression matching for the entire string. The pattern supports these special characters:

- `.` matches any single character.
- `*` matches zero or more occurrences of the immediately preceding element.

The match must consume all of `s`, not merely a substring.

**Constraints:**

- `1 <= s.length <= 20`
- `1 <= p.length <= 20`
- `s` contains only lowercase English letters.
- `p` contains only lowercase English letters, `.` and `*`.
- Every `*` has a valid preceding element; patterns never begin with `*` or contain consecutive `*` characters.

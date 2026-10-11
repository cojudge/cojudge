Given a string containing only digits, insert three dots to split it into four decimal parts that together form a valid IPv4 address. Each part must be between `0` and `255` inclusive, must use only its own digits, and must not carry a leading zero unless the part is exactly `"0"`.

Return every distinct address that uses all the input characters exactly once. The order of the results does not matter.

**Constraints:**
- `1 <= s.length <= 20`
- `s` consists of digits only.

> **Adaptation note:** the original LeetCode return type is `List<String>`; this problem uses the portable `string_list` output type with identical contents.

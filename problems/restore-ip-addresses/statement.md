Given a string containing only digits, insert three dots to split it into four decimal parts that together form a valid IPv4 address. Each part must be between `0` and `255` inclusive, must use only its own digits, and must not carry a leading zero unless the part is exactly `"0"`.

Return every distinct address that uses all the input characters exactly once. The order of the results does not matter.

**Example 1:**
```
Input: s = "25525511135"
Output: ["255.255.11.135","255.255.111.35"]
Explanation: Both splits use all digits with each octet in range and no bad leading zeros.
```

**Example 2:**
```
Input: s = "0000"
Output: ["0.0.0.0"]
Explanation: Each single zero is a valid octet.
```

**Example 3:**
```
Input: s = "101023"
Output: ["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]
Explanation: Five ways to cut the six digits into valid octets.
```

**Constraints:**
- `1 <= s.length <= 20`
- `s` consists of digits only.

> **Adaptation note:** the original LeetCode return type is `List<String>`; this problem uses the portable `string_list` output type with identical contents.

You are given a string `queryIP`. Return `"IPv4"` if it is a valid IPv4 address, `"IPv6"` if it is a valid IPv6 address, and `"Neither"` otherwise.

A valid IPv4 address has 4 decimal groups separated by dots: each group has 1-3 digits, holds a value from 0 to 255, and must not have leading zeroes (so `"0"` is fine but `"01"` is not).

A valid IPv6 address has 8 groups separated by colons: each group has 1-4 hexadecimal digits (`0-9`, `a-f`, `A-F`). The `::` shorthand is not allowed here, so empty groups are invalid.

**Example 1:**
```
Input: queryIP = "172.16.254.1"
Output: "IPv4"
Explanation: Four decimal groups, each 0-255 with no leading zeroes.
```

**Example 2:**
```
Input: queryIP = "2001:0db8:85a3:0:0:8A2E:0370:7334"
Output: "IPv6"
Explanation: Eight groups of 1-4 hexadecimal digits.
```

**Example 3:**
```
Input: queryIP = "256.256.256.256"
Output: "Neither"
Explanation: 256 exceeds the largest allowed IPv4 group value of 255.
```

**Constraints:**
- `1 <= queryIP.length <= 500`
- `queryIP` consists of digits, English letters, `'.'` and `':'`.

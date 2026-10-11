A URL shortening service keeps two maps: one from each long URL to a short code, and one from each short code back to its long URL. Encoding hands out a fresh short link (a fixed prefix plus a new code) for every unseen URL and reuses the existing link for repeats; decoding strips the prefix and looks the code up.

*Adaptation note:* the original problem asks you to design a `Codec` class with separate `encode` and `decode` methods. Since this judge tests single deterministic functions, the task is reduced to a round trip: implement `codecRoundTrip(url)` so that it encodes `url` with a fresh codec and immediately decodes the result. A correct implementation therefore returns its input unchanged for every URL.

**Example 1:**
```
Input: url = "https://leetcode.com/problems/design-tinyurl"
Output: "https://leetcode.com/problems/design-tinyurl"
Explanation: Encoding then decoding restores the original address.
```

**Example 2:**
```
Input: url = "https://example.com/a/long/path?q=1"
Output: "https://example.com/a/long/path?q=1"
Explanation: Query strings survive the round trip untouched.
```

**Example 3:**
```
Input: url = "http://x.co"
Output: "http://x.co"
Explanation: Short addresses round-trip as well.
```

**Constraints:**
- `1 <= url.length <= 500`
- `url` holds printable ASCII characters without spaces (letters, digits, and symbols such as `:/?&=+.-_`).

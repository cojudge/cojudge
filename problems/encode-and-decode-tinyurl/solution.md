## Approach

Build a tiny `Codec` with two dictionaries: long URL to code and code back to long URL, plus a counter that mints a fresh code (base-36 of the counter) for each unseen address. Encoding reuses the stored code for repeats so it stays idempotent, and distinct addresses get distinct codes. Decoding strips the `http://tinyurl.com/` prefix before the reverse lookup. The judge drives one shared `Codec` per test case: it encodes every URL twice and decodes the short link, so the maps must persist across calls.

## Complexity Analysis

- **Time Complexity:** O(L) per URL, where L is the URL length, for hashing and string handling.
- **Space Complexity:** O(L) for the stored entries.

## Implementation

```python
class Codec:
    PREFIX = "http://tinyurl.com/"
    def __init__(self):
        self.long_to_short = {}
        self.short_to_long = {}
        self.counter = 0
    def encode(self, longUrl):
        if longUrl in self.long_to_short:
            return self.PREFIX + self.long_to_short[longUrl]
        key = self._base36(self.counter)
        self.counter += 1
        self.long_to_short[longUrl] = key
        self.short_to_long[key] = longUrl
        return self.PREFIX + key
    def decode(self, shortUrl):
        key = shortUrl.rsplit('/', 1)[-1]
        return self.short_to_long.get(key, "")
    def _base36(self, v):
        digits = "0123456789abcdefghijklmnopqrstuvwxyz"
        if v == 0:
            return "0"
        out = ""
        while v > 0:
            out = digits[v % 36] + out
            v //= 36
        return out
```

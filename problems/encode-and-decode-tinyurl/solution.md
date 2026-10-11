## Approach

Build a tiny `Codec` helper with two dictionaries: long URL to code and code back to long URL, plus a counter that mints a fresh code (base-36 of the counter) for each unseen address. Encoding reuses the stored code for repeats, and decoding strips the fixed prefix before the reverse lookup. The round trip feeds the encoder's output straight into the decoder, which must hand back the original URL.

## Complexity Analysis

- **Time Complexity:** O(L) per URL, where L is the URL length, for hashing and string handling.
- **Space Complexity:** O(L) for the stored entries.

## Implementation

```python
class Solution:
    def codecRoundTrip(self, url: str) -> str:
        class Codec:
            PREFIX = "http://tinyurl.com/"
            def __init__(self):
                self.long_to_short = {}
                self.short_to_long = {}
                self.counter = 0
            def encode(self, long_url):
                if long_url in self.long_to_short:
                    return self.PREFIX + self.long_to_short[long_url]
                key = self._base36(self.counter)
                self.counter += 1
                self.long_to_short[long_url] = key
                self.short_to_long[key] = long_url
                return self.PREFIX + key
            def decode(self, short_url):
                key = short_url.rsplit('/', 1)[-1]
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
        codec = Codec()
        return codec.decode(codec.encode(url))
```

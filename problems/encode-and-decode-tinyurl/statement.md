Design a URL shortening service by implementing a `Codec` class with two methods:

- `encode(longUrl)` turns a long URL into a short URL that starts with `http://tinyurl.com/` followed by a non-empty code. Encoding must be idempotent: encoding an already-seen URL returns its existing short link. Distinct URLs must map to distinct short links, and a short link must never equal its long URL.
- `decode(shortUrl)` strips the prefix, looks the code up, and returns the original long URL.

The judge creates a single `Codec` per test case, encodes every URL twice, decodes the first short link, and checks that both encodes agree, the decoded value equals the input, and the short-link contract above holds for all URLs.

**Constraints:**

- `0 <= urls.length <= 30`
- `1 <= url.length <= 500`
- `url` holds printable ASCII characters without spaces or commas (letters, digits, and symbols such as `:/?&=+.-_~@%#`).

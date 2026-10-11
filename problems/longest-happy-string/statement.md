Call a string `s` **happy** when each of these holds:

- every character of `s` is one of `'a'`, `'b'`, or `'c'`.
- neither `"aaa"`, `"bbb"`, nor `"ccc"` occurs anywhere inside `s`.
- the count of `'a'` inside `s` is **no more than** `a`.
- the count of `'b'` inside `s` is **no more than** `b`.
- the count of `'c'` inside `s` is **no more than** `c`.

You receive three integers `a`, `b`, and `c`. Build the lengthiest happy string achievable. When several answers tie for greatest length, any of them is accepted. When no non-empty happy string exists, give back the empty string `""`.

Here, a substring means a block of characters standing next to each other in the string.

**Constraints:**

- `0 <= a, b, c <= 100`
- `a + b + c > 0`

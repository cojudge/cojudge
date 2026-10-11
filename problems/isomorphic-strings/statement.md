Two strings `s` and `t` are called isomorphic when the characters of one can be consistently renamed to obtain the other: every occurrence of a character in `s` maps to the same character in `t`, and no two different characters of `s` map to the same character of `t`.

Decide whether `s` and `t` are isomorphic.

**Example 1:**
```
Input: s = "egg", t = "add"
Output: true
Explanation: 'e' always becomes 'a' and 'g' always becomes 'd'.
```

**Example 2:**
```
Input: s = "foo", t = "bar"
Output: false
Explanation: Both 'o's would need to become different letters ('a' and 'r'), which is impossible.
```

**Example 3:**
```
Input: s = "paper", t = "title"
Output: true
Explanation: The renaming p->t, a->i, e->l, r->e is consistent in both directions.
```

**Constraints:**
- `1 <= s.length <= 5 * 10^4`
- `s.length == t.length`
- `s` and `t` consist of ASCII characters.

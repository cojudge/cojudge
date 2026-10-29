You receive a helper string `order` that lists distinct lower-case letters
in a custom priority sequence, plus a second string `s` to rearrange. Shrink
or expand nothing: the output must be a permutation of `s` holding exactly
the same multiset of characters.

The rule: whenever a letter `x` appears earlier than a letter `y` inside
`order`, every copy of `x` in your answer must stand before every copy of
`y`. Letters of `s` that never occur in `order` may appear in any trailing
positions, in any order among themselves.

Any permutation meeting those conditions is accepted.

**Constraints:**
- `1 <= order.length <= 26`
- `1 <= s.length <= 200`
- `order` and `s` hold only lower-case English letters.
- All characters of `order` are unique.

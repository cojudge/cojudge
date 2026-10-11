Answer quietness queries over a richer-than hierarchy.

`richer[i] = [a, b]` means person `a` is richer than person `b`. Separately, `quiet[i]` scores how quiet person `i` is (smaller means quieter). For every person `x`, consider `x` together with everyone richer than `x`, directly or transitively. Return an array `answer` where `answer[x]` is the person in that set with the smallest quiet value (ties cannot happen since quiet values are distinct in tests, otherwise pick the smallest index among minima).

**Constraints:**
- `1 <= quiet.length <= 500`
- `0 <= richer.length <= quiet.length * (quiet.length - 1) / 2`
- `0 <= richer[i][0], richer[i][1] < quiet.length`
- `quiet` values are a permutation of `0..n-1` in tests (distinct).

There are `n` different songs. A playlist is a list of exactly `goal` songs satisfying two rules: every one of the `n` songs appears at least once, and whenever a song repeats, at least `k` other songs sit between the two plays (positions of equal songs differ by more than `k`).

Return the number of valid playlists, modulo `10^9 + 7`.

**Constraints:**
- `1 <= k < n <= goal <= 100`

Given a short string `s` and a longer string `t`, decide whether `s` can be obtained from `t` by erasing zero or more characters while leaving the order of the survivors untouched. For instance, keeping positions `0, 2, 4` of `"abcde"` yields `"ace"`, so `"ace"` qualifies, whereas swapping two letters does not.

Return `true` when such a deletion pattern exists and `false` otherwise. An empty `s` is a subsequence of every `t`.

**Constraints:**
- `0 <= s.length <= 100`
- `0 <= t.length <= 10^4`
- `s` and `t` contain only lowercase English letters.

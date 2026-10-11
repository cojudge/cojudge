## Approach

Precompute three lookup structures from the vocabulary: an exact set, a lowercased map keeping each key's first vocabulary word, and a vowel-masked map (lowercase with vowels replaced by a placeholder) likewise keeping first words. Each query then checks the three structures in priority order, falling back to the empty string. All maps are built once, so every query costs only string-length work.

## Complexity Analysis

- **Time Complexity:** O(total characters in wordlist and queries).
- **Space Complexity:** O(total characters in wordlist) for the three maps.

## Implementation

```python
class Solution:
    def spellchecker(self, wordlist: list[str], queries: list[str]) -> list[str]:
        def mask(w):
            return "".join("*" if c in "aeiouAEIOU" else c.lower() for c in w)

        exact = set(wordlist)
        case_map, vowel_map = {}, {}
        for w in wordlist:
            lw = w.lower()
            if lw not in case_map:
                case_map[lw] = w
            m = mask(w)
            if m not in vowel_map:
                vowel_map[m] = w
        ans = []
        for q in queries:
            if q in exact:
                ans.append(q)
            elif q.lower() in case_map:
                ans.append(case_map[q.lower()])
            elif mask(q) in vowel_map:
                ans.append(vowel_map[mask(q)])
            else:
                ans.append("")
        return ans
```

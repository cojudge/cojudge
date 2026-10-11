## Approach

Convert the string to a mutable array and place pointers at both ends. Move each pointer inward past non-vowels; when both rest on vowels, swap them and step onward. Vowel-only positions are therefore reversed while every other character stays fixed. Membership is tested against both cases of a, e, i, o, u.

## Complexity Analysis

- **Time Complexity:** O(n), each character visited at most once.
- **Space Complexity:** O(n) for the mutable copy (O(1) besides output in languages with mutable strings).

## Implementation

```python
class Solution:
    def reverseVowels(self, s: str) -> str:
        vowels = set("aeiouAEIOU")
        a = list(s)
        i, j = 0, len(a) - 1
        while i < j:
            while i < j and a[i] not in vowels:
                i += 1
            while i < j and a[j] not in vowels:
                j -= 1
            if i < j:
                a[i], a[j] = a[j], a[i]
                i += 1
                j -= 1
        return "".join(a)
```

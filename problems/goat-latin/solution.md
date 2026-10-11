## Approach

Split the sentence into words and handle each word by its 1-based index. When the first character is a vowel (checked in both cases) keep the word unchanged, otherwise rotate the leading character to the end. Append "ma" plus the index-many copies of "a", then rejoin everything with single spaces.

## Complexity Analysis

- **Time Complexity:** O(n^2) in the worst case where n is the sentence length, because of the growing trailing a's; linear in the input plus output size.
- **Space Complexity:** O(n^2) for the output string in the worst case.

## Implementation

```python
class Solution:
    def toGoatLatin(self, sentence: str) -> str:
        vowels = set("aeiouAEIOU")
        out = []
        for i, w in enumerate(sentence.split(" "), 1):
            if w[0] in vowels:
                cur = w + "ma"
            else:
                cur = w[1:] + w[0] + "ma"
            cur += "a" * i
            out.append(cur)
        return " ".join(out)
```

## Approach

Look up each letter in the fixed 26-entry Morse table and concatenate the codes for a word. Insert every word encoding into a hash set; distinct dot-dash strings collapse automatically and the set size is the required count.

## Complexity Analysis

- **Time Complexity:** O(S), where S is the total number of characters across all words.
- **Space Complexity:** O(S) for the encoded strings in the set.

## Implementation

```python
from typing import List
class Solution:
    def uniqueMorseRepresentations(self, words: List[str]) -> int:
        morse = [".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."]
        return len({''.join(morse[ord(c) - 97] for c in w) for w in words})
```

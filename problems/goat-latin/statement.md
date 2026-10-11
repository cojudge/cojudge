A sentence is made of words separated by single spaces, with no leading or trailing spaces. Transform it into a playful variant with these rules, applied to each word in order:

- If a word begins with a vowel (`a`, `e`, `i`, `o`, `u`, in either lowercase or uppercase), leave the word as is.
- Otherwise, remove its first letter and append that letter to the end of the word.
- Append the two letters `ma` to every modified word above.
- Finally, append the letter `a` once for the first word, twice for the second word, three times for the third word, and so on.

Return the transformed words joined with single spaces.

**Example 1:**
```
Input: sentence = "I speak Goat Latin"
Output: "Imaa peaksmaaa oatGmaaaa atinLmaaaaa"
Explanation: "I" starts with a vowel, so it becomes "I" + "ma" + "a". "speak" starts with a consonant, so it becomes "peak" + "s" + "ma" + "aa". The same logic applies to the remaining words with three and four trailing a's.
```

**Example 2:**
```
Input: sentence = "The quick brown fox jumped over the lazy dog"
Output: "heTmaa uickqmaaa rownbmaaaa oxfmaaaaa umpedjmaaaaaa overmaaaaaaa hetmaaaaaaaa azylmaaaaaaaaa ogdmaaaaaaaaaa"
```

**Example 3:**
```
Input: sentence = "a"
Output: "amaa"
```

**Constraints:**
- `1 <= sentence.length <= 150`
- `sentence` consists of English letters and single spaces only
- Words are separated by exactly one space, with no leading or trailing spaces

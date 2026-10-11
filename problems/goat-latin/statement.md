A sentence is made of words separated by single spaces, with no leading or trailing spaces. Transform it into a playful variant with these rules, applied to each word in order:

- If a word begins with a vowel (`a`, `e`, `i`, `o`, `u`, in either lowercase or uppercase), leave the word as is.
- Otherwise, remove its first letter and append that letter to the end of the word.
- Append the two letters `ma` to every modified word above.
- Finally, append the letter `a` once for the first word, twice for the second word, three times for the third word, and so on.

Return the transformed words joined with single spaces.

**Constraints:**
- `1 <= sentence.length <= 150`
- `sentence` consists of English letters and single spaces only
- Words are separated by exactly one space, with no leading or trailing spaces

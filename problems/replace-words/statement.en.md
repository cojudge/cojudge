You get a list `dictionary` of root words and a sentence of space-separated words. For each word in the sentence, look for the shortest root that is a prefix of it; when one exists, swap the whole word for that root. Words with no matching root stay unchanged.

Implement `replaceWords(dictionary, sentence)` returning the rebuilt sentence with single spaces.

**Constraints:**
- `1 <= dictionary.length <= 1000`
- `1 <= dictionary[i].length <= 100`
- `1 <= sentence.length <= 10^6`; words hold lowercase letters, joined by single spaces.

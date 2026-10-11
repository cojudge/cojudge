You are given an array of strings `strs`. You will build a circular loop by concatenating the strings in their given order, but before joining you may flip any individual string (write it backwards) or keep it as is.

Once the loop is fixed, choose any cut position inside it and straighten the circle into a linear string beginning at the cut. Among every choice of flips and every cut, return the lexicographically largest stringobtainable. (Compare strings character by character with usual alphabet order.)

**Constraints:**
- `1 <= strs.length <= 1000`
- `1 <= strs[i].length <= 1000`
- `strs[i]` holds lowercase English letters
- Total characters across `strs` fit comfortably for quadratic scanning

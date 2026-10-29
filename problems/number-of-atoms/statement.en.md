A chemical formula is written with element names, multipliers, and parentheses:

- An element name starts with one uppercase letter and may be followed by lowercase letters (for example `H`, `Mg`, `He`).
- A number written right after an element or a closing parenthesis tells how many copies to take. When no number is present, the count is one.
- Parentheses group a section; a number after `)` multiplies every count inside that group. Groups may nest.

Given such a formula, compute how many atoms of each element it holds. Return a compact string that lists every distinct element in alphabetical order, writing the element name followed by its count, but leaving out the count when it equals one.

**Constraints:**
- `1 <= formula.length <= 1000`
- Element names, digits and parentheses only; parentheses are balanced and the formula is valid.

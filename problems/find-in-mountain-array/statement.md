Горный массив удовлетворяет `arr.length >= 3` со значениями, строго увеличивающимися до пика, а затем строго уменьшающимися. Вы не можете получить к нему прямой доступ — взаимодействовать с объектом судьи `mountainArr`:

- `get(index)` возвращает элемент в `index`,
- `length()` возвращает длину массива.

Внедрить `findInMountainArray(target, mountainArr)` возвращая минимальный индекс `k` с `get(k) == target`, или `-1`, если `target` никогда не происходит. Двоичный поиск пик сначала, затем каждая сторона; судья подсчитывает ваши звонки `get` и сообщает Неправильный ответ, если вы превышаете **100** вызовы по тестовому делу.

Имена методов на языке: Java `mountainArr.get(i)` / `mountainArr.length()`, Python `mountainArr.get(i)` / `mountainArr.length()`, C++ `mountainArr.get(i)` / `mountainArr.length()`, C# `mountainArr.Get(i)` / `mountainArr.Length()`, Rust `mountain_arr.get(i)` / `mountain_arr.length()`, Go `mountainArr.Get(i)` / `mountainArr.Length()`, TypeScript `mountainArr.get(i)` / `mountainArr.length()`, PHP `$mountainArr->get($i)` / `$mountainArr->length()`.

**Ограничения:**

- `3 <= mountainArr.length() <= 10^4`
- `0 <= target <= 10^9`
- `0 <= get(index) <= 10^9`
- Скрытый массив — это действительный горный массив.
- В большинстве случаев 100 `get` вызывается в тестовом случае.

Реализуйте множество без использования готовых библиотечных хеш-таблиц.

Реализуйте класс `MyHashSet`:

- `MyHashSet()` создаёт пустое множество.
- `void add(int key)` добавляет значение `key` в множество.
- `bool contains(int key)` возвращает, присутствует ли значение `key` в множестве.
- `void remove(int key)` удаляет значение `key`. Если его нет, ничего не делает.

Сохраните имя класса `MyHashSet`: имя `Solution` зарезервировано проверяющей системой для запускающего кода. Конструктор и методы соответствуют оригиналу. В последовательности результатов конструктору, `add` и `remove` соответствует `null`, а `contains` — `true` или `false`.

**Пример 1:**
```
Вход: operations = ["MyHashSet","add","add","contains","contains","remove","contains"], values = [[],[1],[2],[1],[3],[2],[2]]
Выход: [null,null,null,true,false,null,false]
```
Пояснение: После add(1) и add(2) вызов contains(1) возвращает true, а contains(3) — false. После remove(2) вызов contains(2) возвращает false.

**Пример 2:**
```
Вход: operations = ["MyHashSet","contains","add","contains","remove","contains"], values = [[],[5],[5],[5],[5],[5]]
Выход: [null,false,null,true,null,false]
```
Пояснение: Изначально contains(5) возвращает false. После add(5) — true, после remove(5) — снова false.

**Пример 3:**
```
Вход: operations = ["MyHashSet","add","remove"], values = [[],[7],[7]]
Выход: [null,null,null]
```
Пояснение: Вызовов contains нет, поэтому все элементы результата равны null.

**Ограничения:**
- `0 <= key <= 10^6`
- Суммарно не более `10^4` вызовов `add`, `remove` и `contains`.
- Каждая последовательность начинается с `MyHashSet`.

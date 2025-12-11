# 🎯 Решение проблемы с лайками

## Текущая ситуация
- ❌ Лайки хранятся в localStorage браузера
- ❌ Каждый пользователь видит только свои лайки
- ❌ Лайки не суммируются между пользователями

## Решения

### 1. Firebase Realtime Database (РЕКОМЕНДУЮ)
**Плюсы:**
- ✅ Бесплатно до 1 ГБ данных
- ✅ Не нужен свой сервер
- ✅ Работает в реальном времени
- ✅ Простая интеграция

**Как подключить:**

1. Зарегистрируйтесь на https://firebase.google.com
2. Создайте проект
3. Добавьте в index.html перед </body>:

```html
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-database-compat.js"></script>
<script>
  // Ваши настройки из Firebase Console
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    databaseURL: "https://your-app.firebaseio.com",
    projectId: "your-project-id"
  };
  
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  // Функция для добавления лайка
  function addLike(cardId) {
    const likesRef = database.ref('likes/' + cardId);
    likesRef.transaction((currentLikes) => {
      return (currentLikes || 0) + 1;
    });
  }
  
  // Функция для получения лайков
  function getLikes(cardId, callback) {
    database.ref('likes/' + cardId).on('value', (snapshot) => {
      callback(snapshot.val() || 0);
    });
  }
</script>
```

**Стоимость:** БЕСПЛАТНО для вашего случая

---

### 2. Supabase (альтернатива Firebase)
**Плюсы:**
- ✅ Бесплатно до 500 МБ
- ✅ PostgreSQL база данных
- ✅ Простой API

**Сайт:** https://supabase.com

---

### 3. Простой PHP + MySQL (если есть хостинг)
Если у вас уже есть хостинг с PHP:

**api/likes.php:**
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$db = 'digest_db';
$user = 'your_user';
$pass = 'your_pass';

$conn = new mysqli($host, $user, $pass, $db);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cardId = $_POST['cardId'];
    $conn->query("INSERT INTO likes (card_id, count) VALUES ('$cardId', 1) 
                  ON DUPLICATE KEY UPDATE count = count + 1");
    echo json_encode(['success' => true]);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $cardId = $_GET['cardId'];
    $result = $conn->query("SELECT count FROM likes WHERE card_id = '$cardId'");
    $row = $result->fetch_assoc();
    echo json_encode(['count' => $row['count'] ?? 0]);
}
?>
```

---

### 4. JSON файл на сервере (самый простой)
Если нужно быстро и просто:

**api/likes.json** (создать файл с правами на запись):
```json
{
  "card-0": 0,
  "card-1": 0,
  "training-0": 0
}
```

**api/update-likes.php:**
```php
<?php
header('Content-Type: application/json');
$file = 'likes.json';
$data = json_decode(file_get_contents($file), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cardId = $_POST['cardId'];
    $data[$cardId] = ($data[$cardId] ?? 0) + 1;
    file_put_contents($file, json_encode($data));
}

echo json_encode($data);
?>
```

---

## Что выбрать?

| Вариант | Сложность | Стоимость | Скорость |
|---------|-----------|-----------|----------|
| Firebase | ⭐⭐ | Бесплатно | Быстро |
| Supabase | ⭐⭐ | Бесплатно | Быстро |
| PHP + MySQL | ⭐⭐⭐ | Нужен хостинг | Средне |
| JSON файл | ⭐ | Нужен хостинг | Быстро |

**Мой совет:** Используйте **Firebase** - это самое простое и надежное решение!

---

## Хотите, чтобы я интегрировал Firebase?
Напишите "да" и я добавлю код для работы с общими лайками! 🚀

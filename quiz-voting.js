// ============ КВИЗ "УГАДАЙ ГЕРОЯ" - 30 ВОПРОСОВ ============
const allQuizQuestions = [
  { question: "Кто набрал 100 баллов в аттестации?", options: ["Грачёв Егор", "Крутов Владислав", "Писарева Анастасия", "Митерина Валентина"], correct: 1 },
  { question: "Какая сумма была сэкономлена на скидке пивных стаканов Pasabahce?", options: ["506 796 ₽", "725 587 ₽", "838 000 ₽", "370 000 ₽"], correct: 1 },
  { question: "На сколько процентов выросли продажи Drinksome после мастер-класса в Ярославле?", options: ["100%", "120%", "160%", "200%"], correct: 2 },
  { question: "Кто занял 1 место среди менеджеров КБ Москва?", options: ["Митерина Валентина", "Грачёв Егор", "Решетникова Анна", "Прусакова Юлия"], correct: 1 },
  { question: "Сколько баллов набрала Писарева Анастасия?", options: ["95", "96", "98", "99"], correct: 3 },
  { question: "В какой сети появился малиновый раф на основе сиропа P&D?", options: ["DrinkIt", "Surf Coffee", "Перекрёсток Select", "Starbucks"], correct: 1 },
  { question: "Сколько отелей в сети Cosmos Hotel Group?", options: ["35", "41", "47", "50"], correct: 1 },
  { question: "Какую сумму составила отгрузка пюре P&D?", options: ["5 млн ₽", "7 млн ₽", "9 млн ₽", "11 млн ₽"], correct: 2 },
  { question: "Кто организовала мастер-класс Drinksome в Ярославле?", options: ["Тоцкая Алёна", "Решетникова Анна", "Раби Анастасия", "Спиридонова Мария"], correct: 0 },
  { question: "Сколько ДС переоформила Шиманская Елена?", options: ["41", "47", "51", "55"], correct: 2 },
  { question: "Какая экономия была достигнута на доставке для BDK?", options: ["2 000 евро", "4 000 евро", "6 000 евро", "8 000 евро"], correct: 1 },
  { question: "Сколько SKU новинок заведено по бренду Osnova?", options: ["30", "40", "50", "60"], correct: 2 },
  { question: "Какой кредитный лимит согласован с поставщиком?", options: ["200 000 EUR", "250 000 EUR", "300 000 EUR", "350 000 EUR"], correct: 2 },
  { question: "Сколько клиентов привлекла Александра Кузьмина в конкурсе?", options: ["30", "43", "53", "63"], correct: 2 },
  { question: "Какая сумма транзакций у Надежды Кикашовой?", options: ["283 282 ₽", "333 282 ₽", "383 282 ₽", "433 282 ₽"], correct: 2 },
  { question: "Сколько новых пользователей зарегистрировалось на сайте КБ Ярославль?", options: ["20", "30", "40", "50"], correct: 1 },
  { question: "Какую сумму возвратили после проверок без КТС?", options: ["638 000 ₽", "738 000 ₽", "838 000 ₽", "938 000 ₽"], correct: 2 },
  { question: "На сколько дней ускорено получение продукции ODK?", options: ["20", "25", "30", "35"], correct: 2 },
  { question: "Сколько отсрочка платежа согласована с поставщиком?", options: ["60 дней", "75 дней", "90 дней", "105 дней"], correct: 1 },
  { question: "Какой бренд посуды выбрала Анна Решетникова для Cosmos?", options: ["Pasabahce", "Кунстверк", "Luminarc", "Bormioli"], correct: 1 },
  { question: "Сколько км проехала на велосипеде Мария Спиридонова?", options: ["800", "900", "1000", "1100"], correct: 2 },
  { question: "На какую сумму обеспечена поставка в Большой театр?", options: ["6 млн ₽", "7 млн ₽", "8 млн ₽", "9 млн ₽"], correct: 2 },
  { question: "Сколько точек DrinkIt открыто в Екатеринбурге?", options: ["2", "3", "4", "5"], correct: 2 },
  { question: "Какой кредитный лимит с ООО «Дринксом»?", options: ["2 млн ₽", "3 млн ₽", "4 млн ₽", "5 млн ₽"], correct: 1 },
  { question: "Сколько образцов получено от Неман?", options: ["10", "12", "14", "16"], correct: 2 },
  { question: "Какая экономия на одном контейнере по кодам ТН ВЭД?", options: ["70 000 ₽", "80 000 ₽", "90 000 ₽", "100 000 ₽"], correct: 2 },
  { question: "Сколько товара сохранено при закрытии границ?", options: ["150 000 евро", "175 000 евро", "200 000 евро", "225 000 евро"], correct: 2 },
  { question: "Какая общая экономия по скидкам Pasabahce?", options: ["406 796 ₽", "456 796 ₽", "506 796 ₽", "556 796 ₽"], correct: 2 },
  { question: "Сколько заказов оформлено после звонков Колл-центра?", options: ["37", "42", "47", "52"], correct: 2 },
  { question: "Какая экономия на санкционных товарах без санкционного маршрута?", options: ["4 000 евро", "5 000 евро", "6 000 евро", "7 000 евро"], correct: 2 }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function initQuiz() {
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const resultEl = document.getElementById('result');
  const nextBtn = document.getElementById('next-btn');
  
  if (!questionEl || !optionsEl) return;
  
  // Выбираем 5 случайных вопросов
  selectedQuestions = shuffleArray(allQuizQuestions).slice(0, 5);
  currentQuestionIndex = 0;
  score = 0;
  
  function showQuestion() {
    const q = selectedQuestions[currentQuestionIndex];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = '';
    resultEl.style.display = 'none';
    nextBtn.style.display = 'none';
    
    q.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = option;
      btn.style.cssText = 'background: rgba(190,3,24,0.1); border: 2px solid #be0318; color: #2a0808; padding: 15px 20px; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; text-align: left; width: 100%;';
      btn.onclick = () => checkAnswer(index, btn);
      btn.onmouseover = () => { btn.style.background = 'rgba(190,3,24,0.2)'; btn.style.transform = 'translateX(5px)'; };
      btn.onmouseout = () => { if (!btn.classList.contains('correct') && !btn.classList.contains('wrong')) { btn.style.background = 'rgba(190,3,24,0.1)'; btn.style.transform = 'translateX(0)'; } };
      optionsEl.appendChild(btn);
    });
  }
  
  function checkAnswer(selected, btn) {
    const q = selectedQuestions[currentQuestionIndex];
    const allOptions = optionsEl.querySelectorAll('.quiz-option');
    
    allOptions.forEach(opt => opt.style.pointerEvents = 'none');
    
    if (selected === q.correct) {
      btn.classList.add('correct');
      btn.style.background = '#4CAF50';
      btn.style.color = '#fff';
      btn.style.borderColor = '#4CAF50';
      score++;
      resultEl.textContent = '✅ Правильно!';
      resultEl.style.color = '#4CAF50';
    } else {
      btn.classList.add('wrong');
      btn.style.background = '#f44336';
      btn.style.color = '#fff';
      btn.style.borderColor = '#f44336';
      allOptions[q.correct].classList.add('correct');
      allOptions[q.correct].style.background = '#4CAF50';
      allOptions[q.correct].style.color = '#fff';
      allOptions[q.correct].style.borderColor = '#4CAF50';
      resultEl.textContent = '❌ Неправильно. Правильный ответ: ' + q.options[q.correct];
      resultEl.style.color = '#f44336';
    }
    
    resultEl.style.display = 'block';
    
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      nextBtn.textContent = 'Следующий вопрос';
      nextBtn.style.display = 'block';
    } else {
      nextBtn.textContent = 'Показать результат';
      nextBtn.style.display = 'block';
    }
  }
  
  nextBtn.onclick = () => {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < selectedQuestions.length) {
      showQuestion();
    } else {
      showFinalResult();
    }
  };
  
  function showFinalResult() {
    questionEl.textContent = '🎉 Квиз завершён!';
    optionsEl.innerHTML = '';
    nextBtn.style.display = 'none';
    
    const percentage = Math.round((score / selectedQuestions.length) * 100);
    let message = '';
    
    if (percentage === 100) {
      message = '🏆 Отлично! Вы внимательно читали дайджест!';
    } else if (percentage >= 60) {
      message = '👍 Хорошо! Вы знаете основные достижения команды!';
    } else {
      message = '📖 Стоит перечитать дайджест внимательнее!';
    }
    
    resultEl.innerHTML = `
      <div style="font-size: 2rem; margin-bottom: 10px;">${score} из ${selectedQuestions.length}</div>
      <div>${message}</div>
    `;
    resultEl.style.display = 'block';
    resultEl.style.color = '#2a0808';
  }
  
  showQuestion();
}

// Инициализация квиза при загрузке
if (document.getElementById('quiz-content')) {
  initQuiz();
}

// ============ ЛАЙКИ С FIREBASE ============
function initVoting() {
  const achievementCards = document.querySelectorAll('#sales-moscow .card, #procurement .card, #logistics .card');
  
  // Проверяем, доступен ли Firebase
  const useFirebase = typeof window.firebaseDB !== 'undefined';
  
  if (!useFirebase) {
    console.warn('⚠️ Firebase не настроен. Используется localStorage.');
  }
  
  achievementCards.forEach((card, index) => {
    const cardId = `card-${index}`;
    
    const voteSection = document.createElement('div');
    voteSection.className = 'vote-section';
    
    const voteBtn = document.createElement('button');
    voteBtn.className = 'vote-btn';
    voteBtn.innerHTML = '👍';
    
    const voteCountEl = document.createElement('span');
    voteCountEl.className = 'vote-count';
    voteCountEl.textContent = '0';
    
    if (useFirebase) {
      // Firebase режим
      window.firebaseDB.getLikes(cardId, (count) => {
        voteCountEl.textContent = count;
      });
      
      window.firebaseDB.hasUserVoted(cardId, (hasVoted) => {
        voteBtn.style.opacity = hasVoted ? '1' : '0.4';
        if (hasVoted) voteBtn.classList.add('voted');
      });
      
      voteBtn.onclick = (e) => {
        e.stopPropagation();
        
        window.firebaseDB.hasUserVoted(cardId, (hasVoted) => {
          if (hasVoted) {
            window.firebaseDB.removeLike(cardId);
            window.firebaseDB.setUserVote(cardId, false);
            voteBtn.style.opacity = '0.4';
            voteBtn.classList.remove('voted');
          } else {
            window.firebaseDB.addLike(cardId);
            window.firebaseDB.setUserVote(cardId, true);
            voteBtn.style.opacity = '1';
            voteBtn.classList.add('voted');
          }
          
          voteBtn.style.transform = 'scale(1.3)';
          setTimeout(() => { voteBtn.style.transform = 'scale(1)'; }, 200);
        });
      };
    } else {
      // localStorage fallback
      const votes = JSON.parse(localStorage.getItem('digestVotes') || '{}');
      const userVotes = JSON.parse(localStorage.getItem('digestUserVotes') || '[]');
      
      voteCountEl.textContent = votes[cardId] || 0;
      voteBtn.style.opacity = userVotes.includes(cardId) ? '1' : '0.4';
      
      voteBtn.onclick = (e) => {
        e.stopPropagation();
        const votes = JSON.parse(localStorage.getItem('digestVotes') || '{}');
        const userVotes = JSON.parse(localStorage.getItem('digestUserVotes') || '[]');
        
        if (userVotes.includes(cardId)) {
          votes[cardId] = Math.max(0, (votes[cardId] || 0) - 1);
          userVotes.splice(userVotes.indexOf(cardId), 1);
          voteBtn.style.opacity = '0.4';
        } else {
          votes[cardId] = (votes[cardId] || 0) + 1;
          userVotes.push(cardId);
          voteBtn.style.opacity = '1';
        }
        
        localStorage.setItem('digestVotes', JSON.stringify(votes));
        localStorage.setItem('digestUserVotes', JSON.stringify(userVotes));
        voteCountEl.textContent = votes[cardId];
        
        voteBtn.style.transform = 'scale(1.3)';
        setTimeout(() => { voteBtn.style.transform = 'scale(1)'; }, 200);
      };
    }
    
    voteSection.appendChild(voteBtn);
    voteSection.appendChild(voteCountEl);
    
    const article = card.querySelector('article');
    if (article) {
      article.appendChild(voteSection);
    }
  });
}

// ============ ПОЗДРАВЛЕНИЯ С FIREBASE ============
function initClapReactions() {
  const trainingCards = document.querySelectorAll('#training .card');
  const useFirebase = typeof window.firebaseDB !== 'undefined';
  
  trainingCards.forEach((card, index) => {
    const cardId = `training-${index}`;
    
    const clapBtn = document.createElement('button');
    clapBtn.className = 'vote-btn';
    clapBtn.innerHTML = '🎉';
    clapBtn.style.fontSize = '1.8rem';
    clapBtn.title = 'Поздравить!';
    
    const clapCountEl = document.createElement('span');
    clapCountEl.className = 'vote-count';
    clapCountEl.textContent = '0';
    
    if (useFirebase) {
      window.firebaseDB.getLikes(cardId, (count) => {
        clapCountEl.textContent = count;
      });
      
      window.firebaseDB.hasUserVoted(cardId, (hasVoted) => {
        clapBtn.style.opacity = hasVoted ? '0.4' : '1';
      });
      
      clapBtn.onclick = (e) => {
        e.stopPropagation();
        
        window.firebaseDB.hasUserVoted(cardId, (hasVoted) => {
          if (hasVoted) {
            window.firebaseDB.removeLike(cardId);
            window.firebaseDB.setUserVote(cardId, false);
            clapBtn.style.opacity = '1';
          } else {
            window.firebaseDB.addLike(cardId);
            window.firebaseDB.setUserVote(cardId, true);
            clapBtn.style.opacity = '0.4';
            
            for (let i = 0; i < 5; i++) {
              setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.textContent = '🎉';
                confetti.style.cssText = `
                  position: absolute;
                  font-size: 2rem;
                  pointer-events: none;
                  animation: clap-fly 1s ease-out forwards;
                  left: ${e.clientX}px;
                  top: ${e.clientY}px;
                  z-index: 9999;
                `;
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 1000);
              }, i * 100);
            }
          }
          
          clapBtn.style.transform = 'scale(1.3)';
          setTimeout(() => { clapBtn.style.transform = 'scale(1)'; }, 200);
        });
      };
    } else {
      // localStorage fallback
      const clapVotes = JSON.parse(localStorage.getItem('digestClapVotes') || '{}');
      const userClaps = JSON.parse(localStorage.getItem('digestUserClaps') || '[]');
      
      clapCountEl.textContent = clapVotes[cardId] || 0;
      clapBtn.style.opacity = userClaps.includes(cardId) ? '0.4' : '1';
      
      clapBtn.onclick = (e) => {
        e.stopPropagation();
        const clapVotes = JSON.parse(localStorage.getItem('digestClapVotes') || '{}');
        const userClaps = JSON.parse(localStorage.getItem('digestUserClaps') || '[]');
        
        if (userClaps.includes(cardId)) {
          clapVotes[cardId] = Math.max(0, (clapVotes[cardId] || 0) - 1);
          userClaps.splice(userClaps.indexOf(cardId), 1);
          clapBtn.style.opacity = '1';
        } else {
          clapVotes[cardId] = (clapVotes[cardId] || 0) + 1;
          userClaps.push(cardId);
          clapBtn.style.opacity = '0.4';
          
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              const confetti = document.createElement('div');
              confetti.textContent = '🎉';
              confetti.style.cssText = `position: absolute; font-size: 2rem; pointer-events: none; animation: clap-fly 1s ease-out forwards; left: ${e.clientX}px; top: ${e.clientY}px; z-index: 9999;`;
              document.body.appendChild(confetti);
              setTimeout(() => confetti.remove(), 1000);
            }, i * 100);
          }
        }
        
        localStorage.setItem('digestClapVotes', JSON.stringify(clapVotes));
        localStorage.setItem('digestUserClaps', JSON.stringify(userClaps));
        clapCountEl.textContent = clapVotes[cardId];
        
        clapBtn.style.transform = 'scale(1.3)';
        setTimeout(() => { clapBtn.style.transform = 'scale(1)'; }, 200);
      };
    }
    
    const voteSection = document.createElement('div');
    voteSection.className = 'vote-section';
    voteSection.appendChild(clapBtn);
    voteSection.appendChild(clapCountEl);
    
    const article = card.querySelector('article');
    if (article) {
      article.appendChild(voteSection);
    }
  });
}

// Добавляем CSS анимацию для хлопушек
const style = document.createElement('style');
style.textContent = `
  @keyframes clap-fly {
    0% {
      transform: translate(0, 0) scale(1) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translate(${Math.random() * 200 - 100}px, -150px) scale(0.5) rotate(${Math.random() * 360}deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Инициализация при загрузке
setTimeout(() => {
  initVoting();
  initClapReactions();
}, 500);

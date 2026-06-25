// Outcome Driven JS Engine (Before/After Slider & Timer Quiz)

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Before/After Image Slider
     ========================================================================== */
  const slider = document.querySelector('.slider-container');
  const afterImg = document.querySelector('.img-after');
  const sliderBar = document.querySelector('.slider-bar');
  const sliderButton = document.querySelector('.slider-button');

  if (slider && afterImg && sliderBar) {
    let isDragging = false;

    const moveSlider = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      afterImg.style.width = `${percentage}%`;
      sliderBar.style.left = `${percentage}%`;
      sliderButton.style.left = `${percentage}%`;
    };

    // Desktop
    sliderBar.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveSlider(e.clientX);
    });

    // Touch Support for mobile
    sliderBar.addEventListener('touchstart', () => { isDragging = true; });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      moveSlider(e.touches[0].clientX);
    });
  }

  /* ==========================================================================
     2. Interactive 10s Timer Quiz Game
     ========================================================================== */
  const quizEngine = {
    questions: [
      {
        question: "1. '에빙하우스 망각곡선'에 따르면, 학습한 지 1시간 후 남아있는 단어 기억률은 약 몇 %일까요?",
        options: ["A) 약 80%", "B) 약 60%", "C) 약 44%", "D) 약 20%"],
        correctIndex: 2 // 44%
      },
      {
        question: "2. [맥락 단어 추론] 'The teacher provided a _____ explanation that cleared up all confusion.' 빈칸에 적절한 고난도 활성 어휘는?",
        options: ["A) lucid (명쾌한)", "B) obscure (모호한)", "C) superficial (피상적인)", "D) tedious (지루한)"],
        correctIndex: 0 // lucid
      },
      {
        question: "3. 인비온의 리딩 및 독서 지수 관리 시스템인 'AR/SR'의 명칭은 무엇의 약자일까요?",
        options: ["A) Academic Reading / Student Reading", "B) Accelerated Reader / Star Reading", "C) Advanced Reading / Smart Reading", "D) American Reading / School Reading"],
        correctIndex: 1 // Accelerated Reader / Star Reading
      }
    ],
    currentIndex: 0,
    score: 0,
    timer: null,
    timeLeft: 10,
    isAnswered: false,

    init() {
      if (!document.getElementById('quiz-body')) return;
      this.renderQuestion();
      
      const retryBtn = document.getElementById('retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => this.resetQuiz());
      }
    },

    renderQuestion() {
      this.isAnswered = false;
      this.timeLeft = 10;
      
      const qNumText = document.getElementById('q-num-text');
      const qText = document.getElementById('q-text');
      const optionsBox = document.getElementById('options-box');
      const timerVal = document.getElementById('timer-val');

      if (!qText || !optionsBox || !timerVal) return;

      clearInterval(this.timer);
      timerVal.innerText = `${this.timeLeft}s`;

      const currentQ = this.questions[this.currentIndex];
      qNumText.innerText = `Question ${this.currentIndex + 1} of ${this.questions.length}`;
      qText.innerText = currentQ.question;
      optionsBox.innerHTML = '';

      currentQ.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerText = opt;
        btn.addEventListener('click', () => this.checkAnswer(idx, btn));
        optionsBox.appendChild(btn);
      });

      // Start countdown
      this.timer = setInterval(() => {
        this.timeLeft--;
        timerVal.innerText = `${this.timeLeft}s`;
        if (this.timeLeft <= 0) {
          clearInterval(this.timer);
          this.handleTimeout();
        }
      }, 1000);
    },

    checkAnswer(selectedIndex, clickedBtn) {
      if (this.isAnswered) return;
      this.isAnswered = true;
      clearInterval(this.timer);

      const currentQ = this.questions[this.currentIndex];
      const allButtons = document.querySelectorAll('.quiz-option-btn');
      
      allButtons.forEach((btn, idx) => {
        btn.classList.add('disabled');
        btn.disabled = true;
        if (idx === currentQ.correctIndex) {
          btn.classList.add('correct');
        }
      });

      if (selectedIndex === currentQ.correctIndex) {
        this.score++;
      } else {
        clickedBtn.classList.add('wrong');
      }

      setTimeout(() => this.nextStep(), 2000);
    },

    handleTimeout() {
      if (this.isAnswered) return;
      this.isAnswered = true;
      
      const currentQ = this.questions[this.currentIndex];
      const allButtons = document.querySelectorAll('.quiz-option-btn');
      
      allButtons.forEach((btn, idx) => {
        btn.classList.add('disabled');
        btn.disabled = true;
        if (idx === currentQ.correctIndex) {
          btn.classList.add('correct');
        }
      });

      alert('시간이 초과되었습니다! 다음 문제로 이동합니다.');
      setTimeout(() => this.nextStep(), 2000);
    },

    nextStep() {
      this.currentIndex++;
      if (this.currentIndex < this.questions.length) {
        this.renderQuestion();
      } else {
        this.showResult();
      }
    },

    showResult() {
      const quizBody = document.getElementById('quiz-body');
      const quizResult = document.getElementById('quiz-result');
      const scoreVal = document.getElementById('score-val');
      
      if (!quizBody || !quizResult || !scoreVal) return;

      quizBody.style.display = 'none';
      quizResult.style.display = 'block';
      scoreVal.innerText = `${this.score} / ${this.questions.length}`;
    },

    resetQuiz() {
      this.currentIndex = 0;
      this.score = 0;
      
      const quizBody = document.getElementById('quiz-body');
      const quizResult = document.getElementById('quiz-result');
      
      if (!quizBody || !quizResult) return;

      quizBody.style.display = 'block';
      quizResult.style.display = 'none';
      this.renderQuestion();
    }
  };

  quizEngine.init();
});

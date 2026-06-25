// Friendly Community JS Engine (Stamp Shop Simulator & Chatbot Reservator)

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Interactive Stamp Reward Shop Simulator
     ========================================================================== */
  const stampValEl = document.getElementById('stamp-val');
  const inventoryItems = document.getElementById('inventory-items');
  const shopItems = document.querySelectorAll('.shop-item-card');

  if (stampValEl && inventoryItems) {
    let stamps = 120; // Initial stamps for demo
    const inventoryList = [];

    shopItems.forEach(card => {
      const buyBtn = card.querySelector('.btn-buy');
      const price = parseInt(card.getAttribute('data-price'));
      const name = card.getAttribute('data-name');
      const emoji = card.getAttribute('data-emoji');

      if (buyBtn) {
        buyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (stamps >= price) {
            stamps -= price;
            stampValEl.innerText = stamps;

            // Add to inventory
            inventoryList.push(name);
            renderInventory(emoji, name);
            alert(`🎉 구매 완료! [${name}] 아이템이 내 가방에 추가되었습니다.`);
          } else {
            alert(`❌ 스탬프가 부족합니다! 열심히 공부해서 더 모아보세요.`);
          }
        });
      }
    });

    function renderInventory(emoji, name) {
      if (inventoryItems.innerText === '보관함이 비어 있습니다. 마켓에서 아이템을 구매해보세요!') {
        inventoryItems.innerHTML = '';
      }
      
      const itemBadge = document.createElement('span');
      itemBadge.style.display = 'inline-flex';
      itemBadge.style.alignItems = 'center';
      itemBadge.style.gap = '0.5rem';
      itemBadge.style.backgroundColor = '#FFFFFF';
      itemBadge.style.border = '2px solid #7C2D12';
      itemBadge.style.padding = '0.4rem 0.8rem';
      itemBadge.style.borderRadius = '8px';
      itemBadge.style.fontWeight = '800';
      itemBadge.style.margin = '0.3rem';
      itemBadge.innerText = `${emoji} ${name}`;
      
      inventoryItems.appendChild(itemBadge);
    }
  }

  /* ==========================================================================
     2. Interactive Chatbot Reservation Form
     ========================================================================== */
  const chatBody = document.getElementById('chat-body');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');

  if (chatBody && chatInput && chatSendBtn) {
    const chatSteps = [
      {
        question: "반갑습니다! 인비온 요정 챗봇이에요. 1:1 재미있는 대면 상담 예약을 도와드릴게요! 먼저 학부모님의 성함을 입력해 주세요.",
        field: "parentName"
      },
      {
        question: "감사합니다! 연락 가능한 학부모님 전화번호를 남겨주세요. (예: 010-1234-5678)",
        field: "phone"
      },
      {
        question: "좋습니다! 아이의 이름과 현재 학년은 어떻게 되나요?",
        field: "studentName"
      },
      {
        question: "마지막으로 원하시는 상담 예약 희망 날짜와 요일을 적어주세요. (예: 금요일 오후 3시)",
        field: "dateTime"
      }
    ];

    let currentStep = 0;
    const reservationData = {
      type: 'Friendly Community'
    };

    function appendMessage(text, isAgent = true) {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${isAgent ? 'chat-bubble-agent' : 'chat-bubble-user'}`;
      bubble.innerText = text;
      chatBody.appendChild(bubble);
      
      // Auto scroll
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function processInput() {
      const userText = chatInput.value.trim();
      if (!userText) return;

      appendMessage(userText, false);
      chatInput.value = '';

      // Save data
      const fieldName = chatSteps[currentStep].field;
      reservationData[fieldName] = userText;

      currentStep++;

      if (currentStep < chatSteps.length) {
        setTimeout(() => {
          appendMessage(chatSteps[currentStep].question);
        }, 800);
      } else {
        setTimeout(() => {
          // Finished steps
          appendMessage("와! 상담 신청이 성공적으로 전달되었어요! 원내 선생님이 확인 후 바로 확정 전화를 드릴게요. 대화를 마칩니다. 축하드려요! 💖");
          
          // Complete and save
          saveChatReservation(reservationData);
        }, 1000);
      }
    }

    function saveChatReservation(data) {
      // Map properties to fit standard DB structure
      const formattedData = {
        type: 'Friendly Community',
        parentName: data.parentName,
        phone: data.phone,
        studentName: data.studentName,
        grade: '챗봇 상담 접수',
        date: data.dateTime,
        time: '대기 중',
        createdAt: new Date().toISOString()
      };

      let reservations = JSON.parse(localStorage.getItem('iea_reservations') || '[]');
      reservations.push(formattedData);
      localStorage.setItem('iea_reservations', JSON.stringify(reservations));

      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservations)
      })
      .then(res => res.json())
      .catch(err => console.error(err));
    }

    chatSendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      processInput();
    });

    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        processInput();
      }
    });

    // Start Chatbot first question
    appendMessage(chatSteps[0].question);
  }
});

// Mock data
const mockUsers = [
  { id: 1, name: 'Mila W.', age: 26, location: 'Berlin', distance: 2, interests: ['Travel', 'Photography'], bio: 'Adventurous and always up for new experiences' },
  { id: 2, name: 'Sophie L.', age: 25, location: 'Berlin', distance: 5, interests: ['Hiking', 'Art', 'Coffee'], bio: 'Artist and nature lover' },
  { id: 3, name: 'Emma R.', age: 28, location: 'Berlin', distance: 8, interests: ['Music', 'Yoga', 'Books'], bio: 'Life is better with live music' },
  { id: 4, name: 'Lisa K.', age: 24, location: 'Berlin', distance: 3, interests: ['Food', 'Design', 'Travel'], bio: 'Foodie and design enthusiast' },
  { id: 5, name: 'Anna M.', age: 27, location: 'Berlin', distance: 6, interests: ['Fitness', 'Cooking', 'Movies'], bio: 'Gym rat turned chef' },
];

const mockMatches = [
  { id: 1, name: 'Mila W.', lastMessage: 'That sounds amazing! 🎉', unread: 2, online: true },
  { id: 3, name: 'Emma R.', lastMessage: 'See you tomorrow!', unread: 0, online: false },
  { id: 5, name: 'Anna M.', lastMessage: 'Thanks for the recipe!', unread: 1, online: true },
];

const mockChats = {
  1: [
    { id: 1, sender: 'other', text: 'Hey! How was your day?' },
    { id: 2, sender: 'self', text: 'Great! Just finished a photoshoot in the park' },
    { id: 3, sender: 'other', text: 'That sounds amazing! 🎉' },
  ],
};

const interests = ['Travel', 'Photography', 'Hiking', 'Art', 'Coffee', 'Music', 'Yoga', 'Books', 'Food', 'Design', 'Fitness', 'Cooking', 'Movies', 'Sports', 'Gaming', 'Technology'];

let currentScreen = 'home';
let currentChatId = null;
let selectedInterests = [];

// Navigation
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const screen = btn.dataset.screen;
    switchScreen(screen);
  });
});

function switchScreen(screenName) {
  // Remove active from all screens and nav items
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  
  // Add active to current screen and nav item
  document.getElementById(screenName).classList.add('active');
  document.querySelector(`[data-screen="${screenName}"]`).classList.add('active');
  
  currentScreen = screenName;
  
  // Initialize screen-specific content
  if (screenName === 'discover') {
    initDiscoveryScreen();
  } else if (screenName === 'matches') {
    initMatchesScreen();
  } else if (screenName === 'chat') {
    initChatScreen();
  } else if (screenName === 'home') {
    initHomeScreen();
  }
}

// Home screen
function initHomeScreen() {
  // Story strip
  const storyStrip = document.getElementById('story-strip');
  storyStrip.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const story = document.createElement('button');
    story.className = 'story-item';
    story.textContent = `Story ${i + 1}`;
    storyStrip.appendChild(story);
  }
  
  // Suggested list
  const suggestedList = document.getElementById('suggested-list');
  suggestedList.innerHTML = '';
  mockUsers.slice(0, 3).forEach(user => {
    const card = document.createElement('div');
    card.className = 'suggested-card';
    card.innerHTML = `
      <div class="avatar" style="background: linear-gradient(135deg, hsl(${Math.random() * 360}deg, 70%, 60%), hsl(${Math.random() * 360}deg, 70%, 60%))"></div>
      <div class="info">
        <div class="name">${user.name}</div>
        <div class="meta">${user.age} • ${user.distance}km away</div>
        <div class="tags">
          ${user.interests.map(int => `<span class="tag">${int}</span>`).join('')}
        </div>
      </div>
    `;
    card.addEventListener('click', () => switchScreen('discover'));
    suggestedList.appendChild(card);
  });
}

// Discovery screen
function initDiscoveryScreen() {
  const discoverStack = document.getElementById('discover-stack');
  discoverStack.innerHTML = '';
  
  mockUsers.forEach(user => {
    const card = document.createElement('div');
    card.className = 'profile-card small';
    card.innerHTML = `
      <div class="avatar" style="background: linear-gradient(135deg, hsl(${Math.random() * 360}deg, 70%, 60%), hsl(${Math.random() * 360}deg, 70%, 60%))"></div>
      <div style="flex: 1;">
        <div class="name">${user.name}</div>
        <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">${user.age} • ${user.distance}km • ${user.location}</div>
        <p style="font-size: 13px; margin-bottom: 8px; color: var(--text-secondary);">${user.bio}</p>
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          ${user.interests.map(int => `<span class="tag">${int}</span>`).join('')}
        </div>
      </div>
      <div class="action-row" style="flex-direction: column; gap: 8px; margin: 0;">
        <button class="btn-icon" title="Pass" aria-label="Pass on this user">
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"/></svg>
        </button>
        <button class="btn-icon like" title="Like" aria-label="Like this user">
          <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 016.5 4c1.74 0 3.41.81 4.5 2.09A6.08 6.08 0 0115.5 4 4.5 4.5 0 0120 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
      </div>
    `;
    
    card.querySelector('.btn-icon:first-child').addEventListener('click', () => {
      showNotification('Passed on ' + user.name);
      card.style.opacity = '0.5';
      setTimeout(() => card.remove(), 300);
    });
    
    card.querySelector('.btn-icon.like').addEventListener('click', () => {
      showNotification('Liked ' + user.name + '! ❤️');
      card.style.opacity = '0.5';
      setTimeout(() => card.remove(), 300);
    });
    
    discoverStack.appendChild(card);
  });
  
  // Interest filters
  const interestFilters = document.getElementById('interest-filters');
  interestFilters.innerHTML = '';
  interests.forEach(interest => {
    const tag = document.createElement('button');
    tag.className = 'tag-filter';
    tag.textContent = interest;
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
      if (tag.classList.contains('active')) {
        selectedInterests.push(interest);
      } else {
        selectedInterests = selectedInterests.filter(i => i !== interest);
      }
    });
    interestFilters.appendChild(tag);
  });
}

// Matches screen
function initMatchesScreen() {
  const matchList = document.getElementById('matches-list');
  matchList.innerHTML = '';
  
  mockMatches.forEach(match => {
    const item = document.createElement('div');
    item.className = 'match-item';
    item.innerHTML = `
      <div class="avatar ${match.online ? 'online' : ''}" style="background: linear-gradient(135deg, hsl(${Math.random() * 360}deg, 70%, 60%), hsl(${Math.random() * 360}deg, 70%, 60%))"></div>
      <div class="info">
        <span class="name">${match.name}</span>
        <div class="lastmsg">${match.lastMessage}</div>
      </div>
      ${match.unread > 0 ? `<div class="badge">${match.unread}</div>` : ''}
    `;
    item.addEventListener('click', () => {
      currentChatId = match.id;
      switchScreen('chat');
    });
    matchList.appendChild(item);
  });
}

// Chat screen
function initChatScreen() {
  if (!currentChatId) return;
  
  const match = mockMatches.find(m => m.id === currentChatId);
  const chatHeader = document.getElementById('chat-header');
  chatHeader.innerHTML = `
    <div class="avatar" style="background: linear-gradient(135deg, hsl(${Math.random() * 360}deg, 70%, 60%), hsl(${Math.random() * 360}deg, 70%, 60%))"></div>
    <div class="info">
      <div class="name">${match.name}</div>
      <div class="status">${match.online ? 'Online now' : 'Offline'}</div>
    </div>
  `;
  
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML = '';
  (mockChats[currentChatId] || []).forEach(msg => {
    const msgEl = document.createElement('div');
    msgEl.className = `msg ${msg.sender === 'self' ? 'sent' : 'received'}`;
    msgEl.innerHTML = `
      <div class="bubble">${msg.text}</div>
    `;
    chatMessages.appendChild(msgEl);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  
  chatForm.onsubmit = (e) => {
    e.preventDefault();
    if (!chatInput.value.trim()) return;
    
    const msgEl = document.createElement('div');
    msgEl.className = 'msg sent';
    msgEl.innerHTML = `<div class="bubble">${chatInput.value}</div>`;
    chatMessages.appendChild(msgEl);
    
    // Initialize chat if needed
    if (!mockChats[currentChatId]) mockChats[currentChatId] = [];
    mockChats[currentChatId].push({ id: Date.now(), sender: 'self', text: chatInput.value });
    
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Mock reply
    setTimeout(() => {
      const replyEl = document.createElement('div');
      replyEl.className = 'msg received';
      replyEl.innerHTML = `<div class="bubble">That's awesome! 😊</div>`;
      chatMessages.appendChild(replyEl);
      mockChats[currentChatId].push({ id: Date.now(), sender: 'other', text: "That's awesome! 😊" });
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
  };
  
  // Populate sidebar
  const chatSidebar = document.getElementById('chat-sidebar');
  chatSidebar.innerHTML = '';
  mockMatches.forEach(m => {
    const item = document.createElement('button');
    item.className = 'match-item';
    if (m.id === currentChatId) item.style.background = 'var(--bg-tertiary)';
    item.innerHTML = `
      <div class="avatar ${m.online ? 'online' : ''}" style="background: linear-gradient(135deg, hsl(${Math.random() * 360}deg, 70%, 60%), hsl(${Math.random() * 360}deg, 70%, 60%))"></div>
      <div class="info">
        <span class="name">${m.name}</span>
        <div class="lastmsg" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.lastMessage}</div>
      </div>
    `;
    item.addEventListener('click', () => {
      currentChatId = m.id;
      initChatScreen();
    });
    chatSidebar.appendChild(item);
  });
}

// Notification system
function showNotification(message) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--gradient);
    color: white;
    padding: 12px 24px;
    border-radius: var(--radius-lg);
    font-size: 14px;
    font-weight: 600;
    box-shadow: var(--shadow-md);
    z-index: 100;
    animation: slideUp 0.3s ease;
  `;
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2500);
}

// Initialize
initHomeScreen();

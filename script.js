// Khởi tạo khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    createFloatingBackground();
    renderChampions();
    setupEventListeners();
});

// Tạo floating background elements
function createFloatingBackground() {
    const floatingBg = document.querySelector('.floating-bg');
    const colors = ['rgba(255, 126, 95, 0.1)', 'rgba(254, 180, 123, 0.1)', 'rgba(52, 152, 219, 0.1)', 'rgba(155, 89, 182, 0.1)'];
    
    for (let i = 0; i < 20; i++) {
        const item = document.createElement('div');
        item.classList.add('floating-item');
        
        // Random properties
        const size = Math.random() * 100 + 50;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100 + 100;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = Math.random() * 15;
        const duration = 15 + Math.random() * 20;
        
        item.style.width = `${size}px`;
        item.style.height = `${size}px`;
        item.style.left = `${posX}%`;
        item.style.top = `${posY}%`;
        item.style.background = color;
        item.style.animationDuration = `${duration}s`;
        item.style.animationDelay = `${delay}s`;
        
        floatingBg.appendChild(item);
    }
}

// Tạo danh sách tướng
function renderChampions() {
    const championsGrid = document.getElementById('championsGrid');
    championsGrid.innerHTML = '';
    
    modData.forEach(champion => {
        const card = document.createElement('div');
        card.className = 'champion-card';
        card.dataset.champion = champion.champion;
        
        card.innerHTML = `
            <div class="champion-inner">
                <div class="champion-front">
                    <img src="${champion.skins[0].icon}" class="champion-icon" alt="${champion.champion}">
                    <div class="champion-name">${champion.champion}</div>
                </div>
                <div class="champion-back">
                    <div class="skin-info">${champion.skins.length} skins</div>
                    <button class="download-btn">Xem chi tiết</button>
                </div>
            </div>
        `;
        
        championsGrid.appendChild(card);
    });
}

// Thiết lập các sự kiện
function setupEventListeners() {
    // Sự kiện click cho các thẻ tướng
    document.querySelectorAll('.champion-card').forEach(card => {
        card.addEventListener('click', () => {
            const championName = card.dataset.champion;
            showSkins(championName);
        });
    });
    
    // Sự kiện nút quay lại
    document.getElementById('backToChampions').addEventListener('click', () => {
        document.getElementById('skinsSection').style.display = 'none';
        document.getElementById('skinDetail').style.display = 'none';
        document.getElementById('championsSection').style.display = 'block';
    });
    
    // Tìm kiếm
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        document.querySelectorAll('.champion-card').forEach(card => {
            const championName = card.dataset.champion.toLowerCase();
            if (championName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Hiển thị danh sách skin của tướng
function showSkins(championName) {
    const champion = modData.find(c => c.champion === championName);
    if (!champion) return;
    
    document.getElementById('championsSection').style.display = 'none';
    document.getElementById('skinsSection').style.display = 'grid';
    document.getElementById('selectedChampionName').textContent = championName;
    
    const skinsGrid = document.getElementById('skinsGrid');
    skinsGrid.innerHTML = '';
    
    champion.skins.forEach(skin => {
        const skinCard = document.createElement('div');
        skinCard.className = 'skin-card';
        skinCard.dataset.skin = skin.name;
        
        skinCard.innerHTML = `
            <img src="${skin.icon}" class="skin-icon" alt="${skin.name}">
            <div class="skin-name">${skin.name}</div>
        `;
        
        skinsGrid.appendChild(skinCard);
    });
    
    // Thêm sự kiện click cho các skin
    document.querySelectorAll('.skin-card').forEach(card => {
        card.addEventListener('click', () => {
            const skinName = card.dataset.skin;
            const skin = champion.skins.find(s => s.name === skinName);
            showSkinDetail(champion.champion, skin);
        });
    });
}

// Hiển thị chi tiết skin
function showSkinDetail(championName, skin) {
    document.getElementById('skinsSection').style.display = 'none';
    document.getElementById('skinDetail').style.display = 'block';
    
    document.getElementById('splashImage').src = skin.splash;
    document.getElementById('skinDetailName').textContent = skin.name;
    document.getElementById('championNameInDetail').textContent = championName;
    
    // Thiết lập nút tải
    document.getElementById('downloadButton').onclick = () => {
        // Trong thực tế có thể dùng window.location.href hoặc tạo thẻ a để tải
        const link = document.createElement('a');
        link.href = skin.zip;
        link.download = skin.zip.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
}
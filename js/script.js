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
                    <img src="${champion.skins[0].icon}" 
                         class="champion-icon" 
                         alt="${champion.champion}"
                         data-champion="${champion.champion}">
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
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('champion-icon')) {
            const championName = e.target.dataset.champion;
            const champion = modData.find(c => c.champion === championName);
            if (champion) {
                showSkinPopup(champion.champion, champion.skins);
            }
        }
    });
    
    // Sự kiện click cho card tướng (trừ icon)
    document.querySelectorAll('.champion-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Ngăn sự kiện khi click vào icon
            if (!e.target.classList.contains('champion-icon')) {
                const championName = card.dataset.champion;
                showSkins(championName);
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

// Mở popup danh sách skin
function showSkinPopup(championName, skins) {
    const skinList = document.getElementById('skinList');
    skinList.innerHTML = '';
    skins.forEach(skin => {
        const img = document.createElement('img');
        img.src = skin.icon;
        img.className = 'skin-icon';
        img.onclick = () => showSplashPopup(skin.splash, skin.download);
        skinList.appendChild(img);
    });
    document.getElementById('skinPopup').style.display = 'block';
}

// Mở popup splash art + nút tải
function showSplashPopup(splashUrl, downloadUrl) {
    const container = document.getElementById('splashContainer');
    container.innerHTML = '';
    const splashImg = document.createElement('img');
    splashImg.src = splashUrl;
    const downloadBtn = document.createElement('a');
    downloadBtn.href = downloadUrl;
    downloadBtn.download = '';
    downloadBtn.innerText = 'Tải về';
    downloadBtn.style.display = 'block';
    downloadBtn.style.marginTop = '10px';
    container.appendChild(splashImg);
    container.appendChild(downloadBtn);
    document.getElementById('splashPopup').style.display = 'block';
}

// Đóng popup
function closePopup(id) {
    document.getElementById(id).style.display = 'none';
}

// Ví dụ gán sự kiện (bạn cần thay thế bằng dữ liệu thực tế)
document.querySelectorAll('.champion-icon').forEach(icon => {
    icon.onclick = function () {
        const champion = this.dataset.champion;
        const skins = window.skinData[champion] || [];
        showSkinPopup(champion, skins);
    };
});


// Thêm hàm mở/đóng popup
function showSkinPopup(championName, skins) {
    const skinList = document.getElementById('skinList');
    const popupChampionName = document.getElementById('popupChampionName');
    
    popupChampionName.textContent = championName;
    skinList.innerHTML = '';
    
    skins.forEach(skin => {
        const img = document.createElement('img');
        img.src = skin.icon;
        img.alt = skin.name;
        img.title = skin.name;
        img.onclick = () => {
            closePopup('skinPopup');
            showSplashPopup(skin.splash, skin.zip);
        };
        skinList.appendChild(img);
    });
    
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('skinPopup').style.display = 'block';
}

function showSplashPopup(splashUrl, downloadUrl) {
    const container = document.getElementById('splashContainer');
    container.innerHTML = `
        <img src="${splashUrl}" alt="Splash Art" style="width:100%; border-radius:10px;">
        <a href="${downloadUrl}" download class="download-btn-popup">TẢI VỀ</a>
    `;
    
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('splashPopup').style.display = 'block';
}

function closePopup(id) {
    document.getElementById(id).style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function closeAllPopups() {
    closePopup('skinPopup');
    closePopup('splashPopup');
}

function getMealInfo() {
    const monthInput = document.getElementById('monthPicker').value;
    if (!monthInput) {
        alert('월을 선택해주세요');
        return;
    }

    const yearMonth = monthInput.replace('-', '');
    const ATPT_OFCDC_SC_CODE = 'K10';
    const SD_SCHUL_CODE = '7801158';
    
    const apiUrl = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_YMD=${yearMonth}`;

    fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            displayMealInfo(xmlDoc);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('급식 정보를 불러오는데 실패했습니다.');
        });
}

function displayMealInfo(xmlDoc) {
    const mealList = document.getElementById('mealList');
    mealList.innerHTML = '';

    const rows = xmlDoc.getElementsByTagName('row');
    
    for (let row of rows) {
        const date = row.getElementsByTagName('MLSV_YMD')[0]?.textContent;
        const menu = row.getElementsByTagName('DDISH_NM')[0]?.textContent;
        const formattedDate = formatDate(date);
        
        const mealItem = document.createElement('div');
        mealItem.className = 'meal-item';
        mealItem.innerHTML = `
            <div class="meal-date">${formattedDate}</div>
            <div class="meal-menu">${formatMenu(menu)}</div>
        `;
        
        mealList.appendChild(mealItem);
    }
}

function formatDate(dateString) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}년 ${month}월 ${day}일`;
}

function formatMenu(menuString) {
    return menuString
        .split('<br/>')
        .map(item => item.trim())
        .filter(item => item)
        .join('<br>');
}

// 페이지 로드 시 현재 월 설정
window.onload = function() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    document.getElementById('monthPicker').value = `${year}-${month}`;
    getMealInfo();
};

// グローバル変数
let editingId = null; // 編集中アイテムのID

document.addEventListener('DOMContentLoaded', () => {
  initDropdowns();
  loadSchedules();

  document.getElementById('addBtn').addEventListener('click', addOrUpdateSchedule);
  document.getElementById('cancelBtn').addEventListener('click', cancelEdit);
});

// 曜日表示用の配列
const dayMap = ["日", "月", "火", "水", "木", "金", "土"];

// ドロップダウンの初期化と連動処理
function initDropdowns() {
  const regionSelect = document.getElementById('regionSelect');
  const prefectureSelect = document.getElementById('prefectureSelect');
  const stationSelect = document.getElementById('stationSelect');

  // 地域プルダウン生成
  for (const [key, region] of Object.entries(stationData)) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = region.name;
    regionSelect.appendChild(option);
  }

  // 地域変更時
  regionSelect.addEventListener('change', () => {
    prefectureSelect.innerHTML = '<option value="">都道府県を選択...</option>';
    stationSelect.innerHTML = '<option value="">放送局を選択...</option>';
    stationSelect.disabled = true;
    
    const regionKey = regionSelect.value;
    if (regionKey && stationData[regionKey]) {
      prefectureSelect.disabled = false;
      const prefs = stationData[regionKey].prefectures;
      for (const [pKey, pref] of Object.entries(prefs)) {
        const option = document.createElement('option');
        option.value = pKey;
        option.textContent = pref.name;
        prefectureSelect.appendChild(option);
      }
    } else {
      prefectureSelect.disabled = true;
    }
  });

  // 都道府県変更時
  prefectureSelect.addEventListener('change', () => {
    stationSelect.innerHTML = '<option value="">放送局を選択...</option>';
    
    const regionKey = regionSelect.value;
    const prefKey = prefectureSelect.value;

    if (regionKey && prefKey) {
      stationSelect.disabled = false;
      const stations = stationData[regionKey].prefectures[prefKey].stations;
      stations.forEach(st => {
        const option = document.createElement('option');
        option.value = st.id;
        option.textContent = st.name;
        stationSelect.appendChild(option);
      });
    } else {
      stationSelect.disabled = true;
    }
  });
}

function addOrUpdateSchedule() {
  const day = document.getElementById('daySelect').value;
  const time = document.getElementById('timeInput').value;
  const stationSelect = document.getElementById('stationSelect');
  const stationId = stationSelect.value;
  const stationName = stationSelect.options[stationSelect.selectedIndex]?.text;

  // バリデーション
  if (!time) { alert("時間を入力してください"); return; }
  if (!stationId) { alert("放送局を選択してください"); return; }

  // データ作成
  const newSchedule = {
    id: editingId ? editingId : Date.now(), // 編集時はID維持
    day: parseInt(day),
    time: time,
    stationId: stationId,
    stationName: stationName,
    // 再現用にエリア情報も保存（編集時に復元するため）
    regionVal: document.getElementById('regionSelect').value,
    prefVal: document.getElementById('prefectureSelect').value
  };

  chrome.storage.local.get(['schedules'], (result) => {
    let schedules = result.schedules || [];

    if (editingId) {
      // 編集（既存IDのものを置換）
      const index = schedules.findIndex(s => s.id === editingId);
      if (index !== -1) {
        schedules[index] = newSchedule;
      }
    } else {
      // 新規追加
      schedules.push(newSchedule);
    }
    
    // ソート
    schedules.sort((a, b) => {
      const dayA = a.day === 0 ? 7 : a.day;
      const dayB = b.day === 0 ? 7 : b.day;
      if (dayA !== dayB) return dayA - dayB;
      return a.time.localeCompare(b.time);
    });

    chrome.storage.local.set({ schedules: schedules }, () => {
      loadSchedules();
      resetForm();
    });
  });
}

// 編集モードへの切り替え
function editSchedule(id) {
  chrome.storage.local.get(['schedules'], (result) => {
    const schedules = result.schedules || [];
    const target = schedules.find(s => s.id === id);
    if (!target) return;

    editingId = id; // 編集中のIDをセット

    // フォームに値をセット
    document.getElementById('daySelect').value = target.day;
    document.getElementById('timeInput').value = target.time;

    // ドロップダウンの復元（changeイベントを発火させて中身を作る）
    const regionSelect = document.getElementById('regionSelect');
    regionSelect.value = target.regionVal || "";
    regionSelect.dispatchEvent(new Event('change'));

    const prefectureSelect = document.getElementById('prefectureSelect');
    prefectureSelect.value = target.prefVal || "";
    prefectureSelect.dispatchEvent(new Event('change'));

    const stationSelect = document.getElementById('stationSelect');
    stationSelect.value = target.stationId;

    // ボタンの表示切替
    document.getElementById('addBtn').textContent = "変更を保存";
    document.getElementById('cancelBtn').style.display = "block";
    
    // タイトルを少し強調
    document.querySelector('h2').textContent = "スケジュールの編集";
  });
}

function cancelEdit() {
  resetForm();
}

function resetForm() {
  editingId = null;
  document.getElementById('timeInput').value = "";
  document.getElementById('stationSelect').value = "";
  document.getElementById('addBtn').textContent = "スケジュールに追加";
  document.getElementById('cancelBtn').style.display = "none";
  document.querySelector('h2').textContent = "予約スケジュール登録";
}

function loadSchedules() {
  chrome.storage.local.get(['schedules'], (result) => {
    const schedules = result.schedules || [];
    const list = document.getElementById('scheduleList');
    const emptyMsg = document.getElementById('emptyMsg');
    
    list.innerHTML = '';

    if (schedules.length === 0) {
      emptyMsg.style.display = 'block';
    } else {
      emptyMsg.style.display = 'none';
      schedules.forEach(item => {
        const li = document.createElement('li');
        
        // 表示テキスト
        const textDiv = document.createElement('div');
        textDiv.className = 'schedule-info';
        textDiv.innerHTML = `
          <div><span class="schedule-time">${dayMap[item.day]}曜 ${item.time}</span></div>
          <div class="schedule-station">${item.stationName}</div>
        `;
        
        // ボタンエリア
        const btnDiv = document.createElement('div');
        btnDiv.className = 'action-btns';

        // 変更ボタン
        const editBtn = document.createElement('button');
        editBtn.textContent = '変更';
        editBtn.className = 'edit-btn';
        editBtn.onclick = () => editSchedule(item.id);

        // 削除ボタン
        const delBtn = document.createElement('button');
        delBtn.textContent = '削除';
        delBtn.className = 'delete-btn';
        delBtn.onclick = () => deleteSchedule(item.id);

        btnDiv.appendChild(editBtn);
        btnDiv.appendChild(delBtn);

        li.appendChild(textDiv);
        li.appendChild(btnDiv);
        list.appendChild(li);
      });
    }
  });
}

function deleteSchedule(id) {
  if(confirm("このスケジュールを削除しますか？")) {
    chrome.storage.local.get(['schedules'], (result) => {
      const schedules = result.schedules || [];
      const newSchedules = schedules.filter(item => item.id !== id);
      chrome.storage.local.set({ schedules: newSchedules }, () => {
        // もし編集中のものを削除したらフォームもリセット
        if (editingId === id) resetForm();
        loadSchedules();
      });
    });
  }
}
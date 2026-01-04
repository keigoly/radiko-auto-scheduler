// ==========================================
// Radiko 自動スケジュール＆再生システム (Final Release)
// 表示ログ削除版
// ==========================================

chrome.runtime.onStartup.addListener(scheduleNextAlarm);
chrome.runtime.onInstalled.addListener(scheduleNextAlarm);

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkSchedule") {
    checkAndSwitchStation();
    scheduleNextAlarm(); 
  }
});

function scheduleNextAlarm() {
  const now = new Date();
  const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  const nextAlarmTime = Date.now() + msToNextMinute + 500;
  chrome.alarms.create("checkSchedule", { when: nextAlarmTime });
}

function checkAndSwitchStation() {
  const now = new Date();
  const currentDay = now.getDay();
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const currentTimeString = `${hour}:${minute}`;

  // コンソールログは残しますが、画面には出ません
  console.log(`[Check] ${currentTimeString}`);

  chrome.storage.local.get(['schedules'], (result) => {
    const schedules = result.schedules || [];
    const targetProgram = schedules.find(s => 
      s.day === currentDay &&
      s.time === currentTimeString
    );

    if (targetProgram) {
      console.log(`[Found] ${targetProgram.stationName}`);
      switchStationRelay(targetProgram.stationId);
    }
  });
}

function switchStationRelay(stationId) {
  const targetUrl = `https://radiko.jp/#!/live/${stationId}`;

  chrome.tabs.query({ url: "*://radiko.jp/*" }, (oldTabs) => {
    const alreadyListening = oldTabs.some(tab => 
      tab.url === targetUrl || tab.url.endsWith(stationId)
    );
    if (alreadyListening) {
      oldTabs.forEach(tab => {
        if (tab.url.includes(stationId)) injectSpecificPlayer(tab.id);
      });
      return;
    }

    // 新規タブ作成
    chrome.tabs.create({ url: targetUrl, active: true }, (newTab) => {
      
      const tabUpdateListener = (tabId, changeInfo, tab) => {
        if (tabId === newTab.id && changeInfo.status === 'complete') {
          // 読み込み完了後、2秒待ってスクリプト投入
          setTimeout(() => {
            injectSpecificPlayer(newTab.id);
          }, 2000); 
        }
      };
      
      chrome.tabs.onUpdated.addListener(tabUpdateListener);

      setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(tabUpdateListener);
      }, 180000);

      // 古いタブを閉じる
      if (oldTabs.length > 0) {
        setTimeout(() => {
          const oldTabIds = oldTabs.map(t => t.id);
          chrome.tabs.remove(oldTabIds);
        }, 1500);
      }
    });
  });
}

function injectSpecificPlayer(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: executeSpecificPlay
  }).catch(err => console.log("Injection Error:", err));
}

// ==================================================
// 【ブラウザ内で動くスクリプト】
// 画面表示（statusBox）のコードを削除しました
// ==================================================
function executeSpecificPlay() {
  console.log("[AutoPlay] Silent Mode Start");

  let attempts = 0;
  const maxAttempts = 30; 

  const intervalId = setInterval(() => {
    attempts++;

    // ------------------------------------------------
    // 1. エラーポップアップの検知 → 即リロード
    // ------------------------------------------------
    const errorPopup = document.querySelector('#colorbox');
    
    if (errorPopup && errorPopup.style.display !== 'none' && errorPopup.style.visibility !== 'hidden') {
      const closeBtn = document.querySelector('#cboxClose') || 
                       document.querySelector('.btn-default') || 
                       document.querySelector('#colorbox button');
      
      if (closeBtn) {
        console.log("Error detected. Reloading...");
        closeBtn.click();
        clearInterval(intervalId);
        
        // 即リロード
        setTimeout(() => {
          location.reload();
        }, 500);
        return;
      }
    }

    // ------------------------------------------------
    // 2. 再生ボタンを探す＆押す
    // ------------------------------------------------
    const playBtn = document.querySelector('.play-radio.btn--play') || 
                    document.getElementById('play');

    if (playBtn) {
      const style = window.getComputedStyle(playBtn);
      if (style.display !== 'none' && style.visibility !== 'hidden') {
        
        console.log("Clicking play button...");
        // 赤枠などの装飾も削除しました
        
        playBtn.focus();
        playBtn.click();
        
        playBtn.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
        playBtn.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));
        playBtn.dispatchEvent(new MouseEvent('click', {bubbles: true}));

      } else {
        // 再生成功（ボタン非表示）
        console.log("Success.");
        clearInterval(intervalId);
      }
    } else {
      // プレイヤーエリア内に「一時停止」ボタンがあるか確認（あれば成功）
      if (document.querySelector('.pause-btn') || document.querySelector('.icon--pause')) {
         console.log("Already playing.");
         clearInterval(intervalId);
      }
    }

    if (attempts >= maxAttempts) {
      console.log("Timeout.");
      clearInterval(intervalId);
    }

  }, 1000);
}
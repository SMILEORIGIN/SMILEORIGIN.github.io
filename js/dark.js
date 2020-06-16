const DARK_KEY = 'dark-mode';
const DARK_CLASS = 'dark';

let darkSwitchBtn;
let darkSwitchIcon;
let darkConf = JSON.parse(localStorage.getItem(DARK_KEY)) || { isDark: false, modifyDate: new Date('1976-04-01').toString() };
let isDark = darkConf.isDark;

function init() {
    // 过期判断
    // 1. 当天早上 8 点后 设置 黑暗模式 不重置
    // 2. 当天晚上 10 点后设置 白天模式 不重置
    const modifyDate = new Date(darkConf.modifyDate);

    const nowDate = new Date();
    const hour = nowDate.getHours();

    // 计算 3 个时间点的时间戳
    const nowDateString = nowDate.toString();
    const todayDate = nowDateString.substr(0, 16);
    const timeZone = nowDateString.substr(24);
    // Morning
    const todayMorning = new Date(todayDate + '07:00:00' + timeZone);
    // Evening
    const todayEvening = new Date(todayDate + '19:00:00' + timeZone);
    // Yesterday
    const yesterdayEvening = new Date(todayDate + '00:00:00' + timeZone) - 5 * 60 * 60 * 1000;

    if (hour < 7 || hour >= 19) {
        // dark
        if (isDark) {
            switchMode();
        } else {
            if (!(modifyDate >= todayEvening || (hour < 7 && modifyDate >= yesterdayEvening))) {
                // 无效设置时间 dark
                isDark = true;
                switchMode();
                saveConf();
            }
        }
    } else {
        // day
        if (isDark && modifyDate >= todayMorning) {
            // 有效设置时间
            switchMode();
        } else {
            // 无效设置时间
            isDark = false;
            saveConf();
        }
    }
}

function initEvent() {
    darkSwitchBtn = document.getElementById('dark-switch');
    darkSwitchIcon = document.getElementById('dark-icon');
    if (!darkSwitchBtn || !darkSwitchIcon) {
        setTimeout(initEvent, 100);
    } else {
        darkSwitchIcon.classList = getIconClass(isDark);
        darkSwitchBtn.addEventListener('click', () => {
            isDark = !isDark;
            switchMode();
            saveConf();
        });
    }
}

function saveConf() {
    darkConf.isDark = isDark;
    darkConf.modifyDate = new Date();
    localStorage.setItem(DARK_KEY, JSON.stringify(darkConf));
}

function switchMode() {
    let iconClassList;
    if (document.body) {
        const darkClassList = document.body.classList;

        if (isDark) {
            darkClassList.add(DARK_CLASS);
        } else {
            darkClassList.remove(DARK_CLASS);
        }

        if (darkSwitchIcon) {
            darkSwitchIcon.classList = getIconClass(isDark);
        }
    } else {
        setTimeout(switchMode, 1000 / 60)
    }
}

function getIconClass(isDark) {
    return isDark ? 'fas fa-sun' : 'fas fa-moon';
}

init();
initEvent();

/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
  var timerUpdateDate = 0,
    flagConsole = false,
    flagDigital = false,
    battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery,
    interval,
    // BACKGROUND_URL = "url('./images/bg.jpg')",
    // BACKGROUND_URL = "url('./images/ch_bg_c_05.png')",
    arrDay = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
    arrMonth = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
    modes = ["24hr", "12hr"],
    mode = modes[0];

  /**
   * Updates the date and sets refresh callback on the next day.
   * @private
   * @param {number} prevDay - date of the previous day
   */
  function updateDate(prevDay) {
    // var datetime = tizen.time.getCurrentDateTime(),
    var datetime = new Date(),
      nextInterval,
      strDay = document.getElementById("str-day"),
      strFullDate,
      getDay = datetime.getDay(),
      getDate = datetime.getDate(),
      getMonth = datetime.getMonth();

    // Check the update condition.
    // if prevDate is '0', it will always update the date.
    if (prevDay !== null) {
      if (prevDay === getDay) {
        /**
         * If the date was not changed (meaning that something went wrong),
         * call updateDate again after a second.
         */
        nextInterval = 1000;
      } else {
        /**
         * If the day was changed,
         * call updateDate at the beginning of the next day.
         */
        // Calculate how much time is left until the next day.
        nextInterval =
          (23 - datetime.getHours()) * 60 * 60 * 1000 +
          (59 - datetime.getMinutes()) * 60 * 1000 +
          (59 - datetime.getSeconds()) * 1000 +
          (1000 - datetime.getMilliseconds()) +
          1;
      }
    }

    strFullDate = arrDay[getDay] + " " + getDate + " " + arrMonth[getMonth];
    strDay.innerHTML = strFullDate;

    // If an updateDate timer already exists, clear the previous timer.
    if (timerUpdateDate) {
      clearTimeout(timerUpdateDate);
    }

    // Set next timeout for date update.
    timerUpdateDate = setTimeout(function () {
      updateDate(getDay);
    }, nextInterval);
  }

  /**
   * Updates the current time.
   * @private
   */
  function updateTime() {
    var strHours = document.getElementById("str-hours"),
      strConsole = document.getElementById("str-console"),
      strMinutes = document.getElementById("str-minutes"),
      strSeconds = document.getElementById("str-seconds"),
      strAmpm = document.getElementById("str-ampm"),
      datetime = new Date(),
      // datetime = tizen.time.getCurrentDateTime(),
      hour = datetime.getHours(),
      minute = datetime.getMinutes(),
      seconds = datetime.getSeconds();

    strHours.innerHTML = hour;
    strMinutes.innerHTML = minute.toString().padStart(2, "0");
    strSeconds.innerHTML = seconds.toString().padStart(2, "0");

    if (mode == modes[1]) {
      if (hour < 12) {
        strAmpm.innerHTML = "AM";
        if (hour < 10) {
          strHours.innerHTML = "0" + hour;
        }
      } else {
        strAmpm.innerHTML = "PM";
      }
    }

    // Each 0.5 second the visibility of flagConsole is changed.
    if (flagDigital) {
      if (flagConsole) {
        strConsole.style.visibility = "visible";
        flagConsole = false;
      } else {
        strConsole.style.visibility = "hidden";
        flagConsole = true;
      }
    }
    else {
      strConsole.style.visibility = "visible";
      flagConsole = false;
    }
  }

  /**
   * Sets to background image as BACKGROUND_URL,
   * and starts timer for normal digital watch mode.
   * @private
   */
  function initDigitalWatch() {
    flagDigital = true;
    // document.getElementById("digital-body").style.backgroundImage = BACKGROUND_URL;
    interval = setInterval(updateTime, 500);
  }

  /**
   * Clears timer and sets background image as none for ambient digital watch mode.
   * @private
   */
  function ambientDigitalWatch() {
    flagDigital = false;
    clearInterval(interval);
    document.getElementById("digital-body").style.backgroundImage = "none";
    updateTime();
  }

  /**
   * Gets battery state.
   * Updates battery level.
   * @private
   */
  function getBatteryState() {
    // var batteryLevel = Math.floor(battery.level * 10),
    //   batteryFill = document.getElementById("battery-fill");
    var batteryLevel = 0.25,
      batteryFill = document.getElementById("battery-fill");
    let batteryRec = document.getElementById("battery-rec");
    let maxWidth = batteryRec.offsetWidth;
    // batteryLevel = batteryLevel + 1;
    let fillColor = 120 * batteryLevel;

    batteryFill.style.backgroundColor = `hsl(${fillColor}, 100%, 50%)`;
    batteryFill.style.width = maxWidth * batteryLevel + "px";
  }

  /**
   * Updates watch screen. (time and date)
   * @private
   */
  function updateWatch() {
    updateTime();
    updateDate(0);
  }

  /**
   * Binds events.
   * @private
   */
  function bindEvents() {
    // add eventListener for battery state
    battery.addEventListener("chargingchange", getBatteryState);
    battery.addEventListener("chargingtimechange", getBatteryState);
    battery.addEventListener("dischargingtimechange", getBatteryState);
    battery.addEventListener("levelchange", getBatteryState);

    // add eventListener for timetick
    window.addEventListener("timetick", function () {
      ambientDigitalWatch();
    });

    // add eventListener for ambientmodechanged
    window.addEventListener("ambientmodechanged", function (e) {
      if (e.detail.ambientMode === true) {
        // rendering ambient mode case
        ambientDigitalWatch();

      } else {
        // rendering normal digital mode case
        initDigitalWatch();
      }
    });

    // add eventListener to update the screen immediately when the device wakes up.
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
        updateWatch();
      }
    });

    // add event listeners to update watch screen when the time zone is changed.
    tizen.time.setTimezoneChangeListener(function () {
      updateWatch();
    });
  }

  /**
   * Initializes date and time.
   * Sets to digital mode.
   * @private
   */
  function init() {
    initDigitalWatch();
    updateDate(0);
    getBatteryState();

    // bindEvents();
  }

  window.onload = init();
}());
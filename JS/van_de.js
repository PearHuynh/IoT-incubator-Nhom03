/*-----Firebase----------------------------------------------------------*/
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getDatabase, ref, set, child, get, update, remove } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD9hfx-3RsHVvT1Uw6isnusZAGp80967-w",
    authDomain: "do-an-kc326-nhom3.firebaseapp.com",
    databaseURL: "https://do-an-kc326-nhom3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "do-an-kc326-nhom3",
    storageBucket: "do-an-kc326-nhom3.appspot.com",
    messagingSenderId: "600837808966",
    appId: "1:600837808966:web:3e020a89630301bc9b7b47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getDatabase();
/*-----end Firebase------------------------------------------------------*/


/*-----Control tu 1-----------------------------------------------------*/
var light1_st = 0,
    mist1_st = 0,
    fan1_st = 0,
    mode1_st = 0,
    start1_st = 0,
    connect1_st = 0,
    warning1 = 0,
    temp1 = 0,
    humi1 = 0;
var timeout1 = 0, pre_connect1 = 0;
var temp_max1, temp_min1, humi_max1, humi_min1;

//Den bao 
var led_light_1 = document.getElementById("led_light_1");
var led_mist_1 = document.getElementById("led_mist_1");
var led_fan_1 = document.getElementById("led_fan_1");

var warningled1 = document.getElementById("warningled1");

//text hien thi 
var txt_temp_tu1 = document.getElementById("txt_temp_tu1");
var txt_temp_max_tu1 = document.getElementById("temp_max_tu1");
var txt_temp_min_tu1 = document.getElementById("temp_min_tu1");

var txt_humi_tu1 = document.getElementById("txt_humi_tu1");
var txt_humi_max_tu1 = document.getElementById("humi_max_tu1");
var txt_humi_min_tu1 = document.getElementById("humi_min_tu1");

var txt_mode_tu1 = document.getElementById("txt_mode_tu1");
var txt_connect_tu1 = document.getElementById("txt_connect_tu1");

//setting max min
var in_temp_max1 = document.getElementById("in_temp_max1");
var in_temp_min1 = document.getElementById("in_temp_min1");
var in_humi_max1 = document.getElementById("in_humi_max1");
var in_humi_min1 = document.getElementById("in_humi_min1");

//button
var bt_start1 = document.getElementById("bt_start1");
var bt_mode1 = document.getElementById("bt_mode1");
var bt_fan1 = document.getElementById("bt_fan1");
var bt_show_setting1 = document.getElementById("bt_show_setting1");
var bt_hide_setting1 = document.getElementById("bt_hide_setting1");
var update1 = document.getElementById("update1");

//set event button
bt_start1.addEventListener('click', fc_start_tu1);
bt_mode1.addEventListener('click', fc_mode_tu1);
bt_fan1.addEventListener('click', fc_fan_tu1);
bt_show_setting1.addEventListener('click', fc_show_setting_tu1);
bt_hide_setting1.addEventListener('click', fc_hide_setting_tu1);
update1.addEventListener('click', set_tu_1);

//read sau 100ms
setInterval(function () { read_tu_ap_1(); read_tu_ap_2(); }, 100);

//read du lieu tu database
function read_tu_ap_1() {
    get(child(ref(db), "tu_ap_1/"))
        .then((snapshot) => {
            light1_st = snapshot.val().light;
            mist1_st = snapshot.val().mist;
            fan1_st = snapshot.val().fan;
            mode1_st = snapshot.val().mode;
            start1_st = snapshot.val().start;
            connect1_st = snapshot.val().connect;
            warning1 = snapshot.val().warning;
            temp1 = snapshot.val().temp;
            humi1 = snapshot.val().humi;
        })
        .catch((error) => {
            alert(error)
        })
    get(child(ref(db), "tu_ap_1/set_val"))
        .then((snapshot) => {
            temp_max1 = snapshot.val().temp_max;
            temp_min1 = snapshot.val().temp_min;
            humi_max1 = snapshot.val().humi_max;
            humi_min1 = snapshot.val().humi_min;
            txt_temp_max_tu1.innerHTML = temp_max1 + " C";
            txt_temp_min_tu1.innerHTML = temp_min1 + " C";
            txt_humi_max_tu1.innerHTML = humi_max1 + " %";
            txt_humi_min_tu1.innerHTML = humi_min1 + " %";
        })
        .catch((error) => {
            alert(error)
        })
    LED_tu_ap_1();
    show_state1();
}

//kiem tra hien thi ra den led
function LED_tu_ap_1() {
    if (warning1) {
        warningled1.style.backgroundColor = "red";
    } else {
        warningled1.style.backgroundColor = "rgb(217, 240, 238)";
    }

    if (light1_st) {
        led_light_1.style.backgroundColor = "red";
    } else {
        led_light_1.style.backgroundColor = "gray";
    }
    if (mist1_st) {
        led_mist_1.style.backgroundColor = "red";
    } else {
        led_mist_1.style.backgroundColor = "gray";
    }
    if (fan1_st) {
        led_fan_1.style.backgroundColor = "red";
    } else {
        led_fan_1.style.backgroundColor = "gray";
    }
}

//kiem tra trang thai cac nut nhan va che do
function show_state1() {
    if (start1_st) {
        bt_start1.style.backgroundColor = "yellow";
        bt_start1.style.color = "black";
        bt_start1.innerHTML = "STOP";
    } else {
        bt_start1.style.backgroundColor = "green";
        bt_start1.style.color = "white";
        bt_start1.innerHTML = "START";
    }

    if (mode1_st) {
        txt_mode_tu1.innerHTML = "AUTO";
        bt_mode1.style.backgroundColor = "red";
    } else {
        txt_mode_tu1.innerHTML = "MANUAL";
        bt_mode1.style.backgroundColor = "gray";
    }

    if (pre_connect1 != connect1_st) {
        timeout1 = 0;
        txt_connect_tu1.innerHTML = "Connected"
        txt_temp_tu1.innerHTML = temp1 + " C";
        txt_humi_tu1.innerHTML = humi1 + " %";
        pre_connect1 = connect1_st;
    } else {
        if (++timeout1 > 100) {
            txt_connect_tu1.innerHTML = "Disconnected"
            timeout1 = 0;
            txt_temp_tu1.innerHTML = 0 + " C";
            txt_humi_tu1.innerHTML = 0 + " %";
        }
    }
}

//chuong trinh setting max min
function set_tu_1() {
    if (in_temp_max1.value != null && in_temp_max1.value != "" && !isNaN(in_temp_max1.value)) {
        if (in_temp_min1.value != null && in_temp_min1.value != "" && !isNaN(in_temp_min1.value)) {
            if (in_temp_max1.value >= in_temp_min1.value) {
                update(ref(db, "tu_ap_1/set_val/"), {
                    temp_max: parseInt(in_temp_max1.value),
                })
                    .catch((error) => { alert(error) })
                update(ref(db, "tu_ap_1/set_val/"), {
                    temp_min: parseInt(in_temp_min1.value),
                })
                    .catch((error) => { alert(error) })
            } else {
                alert("Temp max phải lớn hơn temp min.")
            }
        } else {
            alert("Vui lòng nhập temp min là một số!")
        }
    } else {
        alert("Vui lòng nhập temp max là một số!")
    }

    if (in_humi_max1.value != null && in_humi_max1.value != "" && !isNaN(in_humi_max1.value)) {
        if (in_humi_min1.value != null && in_humi_min1.value != "" && !isNaN(in_humi_min1.value)) {
            if (in_humi_max1.value >= in_humi_min1.value) {
                update(ref(db, "tu_ap_1/set_val/"), {
                    humi_max: parseInt(in_humi_max1.value),
                })
                    .catch((error) => { alert(error) })
                update(ref(db, "tu_ap_1/set_val/"), {
                    humi_min: parseInt(in_humi_min1.value),
                })
                    .catch((error) => { alert(error) })
            } else {
                alert("Humi max phải lớn hơn humi min.")
            }
        } else {
            alert("Vui lòng nhập humi min là một số!")
        }
    } else {
        alert("Vui lòng nhập humi max là một số!")
    }
}

//nut start
function fc_start_tu1() {
    if (start1_st) {
        update(ref(db, "tu_ap_1/"), {
            start: 0,
        })
            .catch((error) => { alert(error) })
    } else {
        update(ref(db, "tu_ap_1/"), {
            start: 1,
        })
            .catch((error) => { alert(error) })
    }
}

//nut mode
function fc_mode_tu1() {
    if (mode1_st) {
        update(ref(db, "tu_ap_1/"), {
            mode: 0,
        })
            .catch((error) => { alert(error) })
    } else {
        update(ref(db, "tu_ap_1/"), {
            mode: 1,
        })
            .catch((error) => { alert(error) })
    }
}

//nut fan
function fc_fan_tu1() {
    if (!mode1_st) {
        if (fan1_st) {
            update(ref(db, "tu_ap_1/"), {
                fan: 0,
            })
                .catch((error) => { alert(error) })
        } else {
            update(ref(db, "tu_ap_1/"), {
                fan: 1,
            })
                .catch((error) => { alert(error) })
        }
    }
}

//nut hien setting
function fc_show_setting_tu1() {
    var form = document.getElementById("input_tu_1");
    form.classList.add("show");
    bt_show_setting1.style.backgroundColor = "red";
}

//nut an setting
function fc_hide_setting_tu1() {
    var form = document.getElementById("input_tu_1");
    form.classList.remove("show");
    bt_show_setting1.style.backgroundColor = "gray";
}
/*-----end Tu 1--------------------------------------------------------- */

/*-----Control tu 2--------------------------------------------------------- */
//Bo cuc giong nhu tu 1
var light2_st,
    mist2_st,
    fan2_st,
    mode2_st,
    start2_st,
    connect2_st = 0,
    warning2 = 0,
    temp2 = 0,
    humi2 = 0;
var timeout2 = 0, pre_connect2 = 0;

var led_light_2 = document.getElementById("led_light_2");
var led_mist_2 = document.getElementById("led_mist_2");
var led_fan_2 = document.getElementById("led_fan_2");

var warningled2 = document.getElementById("warningled2");

var txt_temp_tu2 = document.getElementById("txt_temp_tu2");
var txt_temp_max_tu2 = document.getElementById("temp_max_tu2");
var txt_temp_min_tu2 = document.getElementById("temp_min_tu2");

var txt_humi_tu2 = document.getElementById("txt_humi_tu2");
var txt_humi_max_tu2 = document.getElementById("humi_max_tu2");
var txt_humi_min_tu2 = document.getElementById("humi_min_tu2");

var txt_mode_tu2 = document.getElementById("txt_mode_tu2");
var txt_connect_tu2 = document.getElementById("txt_connect_tu2");

var in_temp_max2 = document.getElementById("in_temp_max2");
var in_temp_min2 = document.getElementById("in_temp_min2");
var in_humi_max2 = document.getElementById("in_humi_max2");
var in_humi_min2 = document.getElementById("in_humi_min2");

var bt_start2 = document.getElementById("bt_start2");
var bt_mode2 = document.getElementById("bt_mode2");
var bt_fan2 = document.getElementById("bt_fan2");
var bt_show_setting2 = document.getElementById("bt_show_setting2");
var bt_hide_setting2 = document.getElementById("bt_hide_setting2");
var update2 = document.getElementById("update2");

bt_start2.addEventListener('click', fc_start_tu2);
bt_mode2.addEventListener('click', fc_mode_tu2);
bt_fan2.addEventListener('click', fc_fan_tu2);
bt_show_setting2.addEventListener('click', fc_show_setting_tu2);
bt_hide_setting2.addEventListener('click', fc_hide_setting_tu2);
update2.addEventListener('click', set_tu_2);

function read_tu_ap_2() {
    get(child(ref(db), "tu_ap_2/"))
        .then((snapshot) => {
            light2_st = snapshot.val().light;
            mist2_st = snapshot.val().mist;
            fan2_st = snapshot.val().fan;
            mode2_st = snapshot.val().mode;
            start2_st = snapshot.val().start;
            connect2_st = snapshot.val().connect;
            warning2 = snapshot.val().warning;
            temp2 = snapshot.val().temp;
            humi2 = snapshot.val().humi;
        })
        .catch((error) => {
            alert(error)
        })
    get(child(ref(db), "tu_ap_2/set_val"))
        .then((snapshot) => {
            txt_temp_max_tu2.innerHTML = snapshot.val().temp_max + " C";
            txt_temp_min_tu2.innerHTML = snapshot.val().temp_min + " C";
            txt_humi_max_tu2.innerHTML = snapshot.val().humi_max + " %";
            txt_humi_min_tu2.innerHTML = snapshot.val().humi_min + " %";
        })
        .catch((error) => {
            alert(error)
        })
    LED_tu_ap_2();
    show_state2();
}

function LED_tu_ap_2() {
    if (warning2) {
        warningled2.style.backgroundColor = "red";
    } else {
        warningled2.style.backgroundColor = "rgb(217, 240, 238)";
    }
    if (light2_st) {
        led_light_2.style.backgroundColor = "red";
    } else {
        led_light_2.style.backgroundColor = "gray";
    }
    if (mist2_st) {
        led_mist_2.style.backgroundColor = "red";
    } else {
        led_mist_2.style.backgroundColor = "gray";
    }
    if (fan2_st) {
        led_fan_2.style.backgroundColor = "red";
    } else {
        led_fan_2.style.backgroundColor = "gray";
    }
}
function show_state2() {
    if (start2_st) {
        bt_start2.style.backgroundColor = "yellow";
        bt_start2.style.color = "black";
        bt_start2.innerHTML = "STOP";
    } else {
        bt_start2.style.backgroundColor = "green";
        bt_start2.style.color = "white";
        bt_start2.innerHTML = "START";
    }

    if (mode2_st) {
        txt_mode_tu2.innerHTML = "AUTO";
        bt_mode2.style.backgroundColor = "red";
    } else {
        txt_mode_tu2.innerHTML = "MANUAL";
        bt_mode2.style.backgroundColor = "gray";
    }

    if (pre_connect2 != connect2_st) {
        timeout2 = 0;
        txt_connect_tu2.innerHTML = "Connected"
        txt_temp_tu2.innerHTML = temp2 + " C";
        txt_humi_tu2.innerHTML = humi2 + " %";
        pre_connect2 = connect2_st;
    } else {
        if (++timeout2 > 100) {
            txt_connect_tu2.innerHTML = "Disconnected"
            txt_temp_tu2.innerHTML = 0 + " C";
            txt_humi_tu2.innerHTML = 0 + " %";
            timeout2 = 0;
        }
    }
}

function set_tu_2() {
    if (in_temp_max2.value != null && in_temp_max2.value != "" && !isNaN(in_temp_max2.value)) {
        if (in_temp_min2.value != null && in_temp_min2.value != "" && !isNaN(in_temp_min2.value)) {
            if (in_temp_max2.value >= in_temp_min2.value) {
                update(ref(db, "tu_ap_2/set_val/"), {
                    temp_max: parseInt(in_temp_max2.value),
                })
                    .catch((error) => { alert(error) })
                update(ref(db, "tu_ap_2/set_val/"), {
                    temp_min: parseInt(in_temp_min2.value),
                })
                    .catch((error) => { alert(error) })
            } else {
                alert("Temp max phải lớn hơn temp min.")
            }
        } else {
            alert("Vui lòng nhập temp min là một số!")
        }
    } else {
        alert("Vui lòng nhập temp max là một số!")
    }

    if (in_humi_max2.value != null && in_humi_max2.value != "" && !isNaN(in_humi_max2.value)) {
        if (in_humi_min2.value != null && in_humi_min2.value != "" && !isNaN(in_humi_min2.value)) {
            if (in_humi_max2.value >= in_humi_min2.value) {
                update(ref(db, "tu_ap_2/set_val/"), {
                    humi_max: parseInt(in_humi_max2.value),
                })
                    .catch((error) => { alert(error) })
                update(ref(db, "tu_ap_2/set_val/"), {
                    humi_min: parseInt(in_humi_min2.value),
                })
                    .catch((error) => { alert(error) })
            } else {
                alert("Humi max phải lớn hơn humi min.")
            }
        } else {
            alert("Vui lòng nhập humi min là một số!")
        }
    } else {
        alert("Vui lòng nhập humi max là một số!")
    }
}

function fc_start_tu2() {
    if (start2_st) {
        update(ref(db, "tu_ap_2/"), {
            start: 0,
        })
            .catch((error) => { alert(error) })
    } else {
        update(ref(db, "tu_ap_2/"), {
            start: 1,
        })
            .catch((error) => { alert(error) })
    }
}
function fc_mode_tu2() {
    if (mode2_st) {
        update(ref(db, "tu_ap_2/"), {
            mode: 0,
        })
            .catch((error) => { alert(error) })
    } else {
        update(ref(db, "tu_ap_2/"), {
            mode: 1,
        })
            .catch((error) => { alert(error) })
    }
}
function fc_fan_tu2() {
    if (!mode2_st) {
        if (fan2_st) {
            update(ref(db, "tu_ap_2/"), {
                fan: 0,
            })
                .catch((error) => { alert(error) })
        } else {
            update(ref(db, "tu_ap_2/"), {
                fan: 2,
            })
                .catch((error) => { alert(error) })
        }
    }
}
function fc_show_setting_tu2() {
    var form = document.getElementById("input_tu_2");
    form.classList.add("show");
    bt_show_setting2.style.backgroundColor = "red";
}
function fc_hide_setting_tu2() {
    var form = document.getElementById("input_tu_2");
    form.classList.remove("show");
    bt_show_setting2.style.backgroundColor = "gray";
}

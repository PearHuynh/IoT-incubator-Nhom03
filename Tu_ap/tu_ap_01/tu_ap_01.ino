#include "keypad.h"
#include "port.h"
#include "wifi.h"

#include <ArduinoJson.h>
#include <FirebaseESP32.h>

// #define FIREBASE_HOTS "test-connect-3dc19-default-rtdb.asia-southeast1.firebasedatabase.app"
// #define FIREBASE_AUTH "TJnKRZDxi8JHvZGdcqK7abvdgxRoVpyfj0HliLR0"

#define FIREBASE_HOTS "do-an-kc326-nhom3-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "rR5I5d6Gw7ndXjpVQZF8auNYoD9U3GLKNA9aW3Mr"

FirebaseData fbdb;

uint8_t start_st = 0;
uint8_t light_st = 0;
uint8_t fan_st = 0;
uint8_t mode_st = 0;
uint8_t mist_st = 0;
uint8_t canh_bao_led = 0;
uint8_t connect = 0;

uint8_t set_temp_max = 35;
uint8_t set_temp_min = 30;
uint8_t set_humi_max = 75;
uint8_t set_humi_min = 60;

int temp_val = 0;
int humi_val = 0;

int time_connect = 0;

void setup() {
  Serial.begin(115200);
  setup_wifi();
  Firebase.begin(FIREBASE_HOTS, FIREBASE_AUTH);
  setup_interrupt_pin();

  pinMode(LED_mode, OUTPUT);
  pinMode(LED_light, OUTPUT);
  pinMode(LED_fan, OUTPUT);
  pinMode(LED_start, OUTPUT);
  pinMode(LED_mist, OUTPUT);
  pinMode(LED_canh_bao, OUTPUT);

  time_connect = millis();
}

void loop() {
  if(millis() - time_connect > 1000){
    connect = !connect;
    time_connect = millis();
  }
  read_button_and_firebase();
  read_sensor();
  if (start_st) {
    if (mode_st) {
      control_auto();
    } else {
      mist_st = 0;
      control_manu();
    }
  } else {
    light_st = 0;
    mist_st = 0;
    fan_st = 0;
  }
  send_firebase();
  delay(100);
}

void control_auto() {
  if (temp_val > set_temp_max) {
    light_st = 0;
    canh_bao_led = 1;
    if (humi_val < set_humi_max) {
      mist_st = 1;
      fan_st = 1;
    } else {
      mist_st = 0;
      fan_st = 1;
    }
  } else if (temp_val < set_temp_min) {
    canh_bao_led = 0;
    mist_st = 0;
    light_st = 1;
    fan_st = 1;
  } else {
    canh_bao_led = 0;
    if (humi_val > set_humi_max) {
      light_st = 1;
      fan_st = 1;
    } else if (humi_val < set_humi_min) {
      mist_st = 1;
      fan_st = 1;
    } else {
      light_st = 0;
      mist_st = 0;
      fan_st = 0;
    }
  }
}

void control_manu() {
  if (temp_val < set_temp_min) {
    light_st = 1;
  } else {
    light_st = 0;
  }
  if(temp_val > set_temp_max){
    canh_bao_led = 1;
  } else {
    canh_bao_led = 0;
  }
}

void read_button_and_firebase() {
  if (start_st) {
    Firebase.getInt(fbdb, "/tu_ap_1/set_val/temp_max");
    if (set_temp_max != fbdb.intData()) {
      set_temp_max = fbdb.intData();
    }
    Firebase.getInt(fbdb, "/tu_ap_1/set_val/temp_min");
    if (set_temp_min != fbdb.intData()) {
      set_temp_min = fbdb.intData();
    }
    Firebase.getInt(fbdb, "/tu_ap_1/set_val/humi_max");
    if (set_humi_max != fbdb.intData()) {
      set_humi_max = fbdb.intData();
    }
    Firebase.getInt(fbdb, "/tu_ap_1/set_val/humi_min");
    if (set_humi_min != fbdb.intData()) {
      set_humi_min = fbdb.intData();
    }
  }

  //Read start button and database------------------------------------------------------
  if (btstart) {
    btstart = false;
    start_st = !start_st;
    digitalWrite(LED_start, start_st);
    Firebase.setInt(fbdb, "/tu_ap_1/start", start_st);
  } else {
    Firebase.getInt(fbdb, "/tu_ap_1/start");
    if (start_st != fbdb.intData()) {
      start_st = fbdb.intData();
    }
    digitalWrite(LED_start, start_st);
  }

  //Read mode button and database------------------------------------------------------
  if (btmode) {
    btmode = false;
    mode_st = !mode_st;
    digitalWrite(LED_mode, mode_st);
    Firebase.setInt(fbdb, "/tu_ap_1/mode", mode_st);
  } else {
    Firebase.getInt(fbdb, "/tu_ap_1/mode");
    if (mode_st != fbdb.intData()) {
      mode_st = fbdb.intData();
    }
    digitalWrite(LED_mode, mode_st);
  }

  //Read fan button and database------------------------------------------------------
  if (btfan) {
    btfan = false;
    if (!mode_st) {
      fan_st = !fan_st;
      digitalWrite(LED_fan, fan_st);
      Firebase.setInt(fbdb, "/tu_ap_1/fan", fan_st);
    }
  } else {
    if (!mode_st) {
      Firebase.getInt(fbdb, "/tu_ap_1/fan");
      if (fan_st != fbdb.intData()) {
        fan_st = fbdb.intData();
      }
    }
    // digitalWrite(LED_fan, fan_st);
  }
  //---------------------------------------------------------------------------------
}

void send_firebase() {
  Firebase.setInt(fbdb, "/tu_ap_1/temp", temp_val);
  Firebase.setInt(fbdb, "/tu_ap_1/humi", humi_val);
  digitalWrite(LED_light, light_st);
  digitalWrite(LED_mist, mist_st);
  digitalWrite(LED_fan, fan_st);
  digitalWrite(LED_canh_bao, canh_bao_led);
  Firebase.setInt(fbdb, "/tu_ap_1/light", light_st);
  Firebase.setInt(fbdb, "/tu_ap_1/mist", mist_st);
  Firebase.setInt(fbdb, "/tu_ap_1/fan", fan_st);
  Firebase.setInt(fbdb, "/tu_ap_1/connect", connect);
  Firebase.setInt(fbdb, "/tu_ap_1/warning", canh_bao_led);
}

void read_sensor() {
    if (start_st) {
      temp_val = map(analogRead(DHT_temp), 0, 4095, 0, 50);
      humi_val = map(analogRead(DHT_humi), 0, 4095, 0, 100);
    } else {
      temp_val = 0;
      humi_val = 0;
    }
}

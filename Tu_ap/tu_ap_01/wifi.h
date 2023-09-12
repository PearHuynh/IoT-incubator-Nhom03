#ifndef __WIFI_H
#define __WIFI_H

//Khai báo thư viện-----------------------------------------------------------------------------------
#include <WiFi.h>
#include <stdio.h>

//Khai báo chương trình con---------------------------------------------------------------------------
void Connect_WiFi();
void LED_Connect_WiFi(void *parameter);
void setup_task();

//Khai báo các biến----------------------------------------------------------------------------------
#define WIFI_SSID "TP-Link_Pear"
#define WIFI_PASSWORD "03102003"

#define LED_Connect_Wifi 23

//Chương trình tạo new task--------------------------------------------------------------------------
TaskHandle_t task1;
void setup_wifi() {
  pinMode(LED_Connect_Wifi, OUTPUT);
  Connect_WiFi();
  WiFi.setAutoReconnect(true);
  xTaskCreate(LED_Connect_WiFi, "LED_Connect_WiFi", 1023, NULL, 1, &task1);
}

//Chương trình thực hiện tasktask1----------------------------------------------------------------------
void LED_Connect_WiFi(void *parameter) {
  TickType_t last_tick_count = xTaskGetTickCount();
  TickType_t period_200 = pdMS_TO_TICKS(200);
  TickType_t period_1000 = pdMS_TO_TICKS(1000);
  bool st = 0;
  while (1) {
    if (WiFi.status() == WL_CONNECTED) {
      st = !st;
      digitalWrite(LED_Connect_Wifi, st);
      vTaskDelayUntil(&last_tick_count, period_1000);
    } else {
      st = !st;
      digitalWrite(LED_Connect_Wifi, st);
      vTaskDelayUntil(&last_tick_count, period_200);
    }
  }
}

//Chương trình connect wifi-----------------------------------------------------------------------
void Connect_WiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("----------------------Connecting to Wifi.------------------------");
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LED_Connect_Wifi, 1);
    delay(200);
    digitalWrite(LED_Connect_Wifi, 0);
    delay(200);
  }
  Serial.print("----------------------Connect with IP: ");
  Serial.println(WiFi.localIP());
}

#endif

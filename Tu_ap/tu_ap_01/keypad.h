#ifndef __KEYPAD_H
#define __KEYPAD_H

#include "port.h"

volatile  bool btstart = false;
volatile  bool btmode = false;
volatile  bool btfan = false;

void IRAM_ATTR ISR_func1() {
  btstart = true;
}
void IRAM_ATTR ISR_func2() {
  btmode = true;
}
void IRAM_ATTR ISR_func3() {
  btfan = true;
}

void setup_interrupt_pin(){
  pinMode(BT_1, INPUT_PULLUP);
  pinMode(BT_2, INPUT_PULLUP);
  pinMode(BT_3, INPUT_PULLUP);

  attachInterrupt(digitalPinToInterrupt(BT_1), ISR_func1, RISING);
  attachInterrupt(digitalPinToInterrupt(BT_2), ISR_func2, RISING);
  attachInterrupt(digitalPinToInterrupt(BT_3), ISR_func3, RISING);
}

#endif

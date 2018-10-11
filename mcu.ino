int led1 = 14;
String input;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(led1, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
    input = Serial.readString();
    if (input == "on") {
      digitalWrite(led1, HIGH);
    } else {
      digitalWrite(led1, LOW);
    }
  }
  delay(1);
}

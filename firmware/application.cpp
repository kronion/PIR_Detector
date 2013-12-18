int PIR = D6;
int detected = 0;

void setup() {
    pinMode(PIR, INPUT);
    Spark.variable("detected", &detected, INT);
}

void loop() {
    detected = digitalRead(PIR);
}

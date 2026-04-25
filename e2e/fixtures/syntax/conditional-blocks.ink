VAR met_blofeld = false

-> start

=== start ===
* [Meet Blofeld]
    ~ met_blofeld = true
    You meet Blofeld.
    -> check_status
* [Check status]
    -> check_status

=== check_status ===
{met_blofeld: "You have met Blofeld." | "You haven't met Blofeld yet."}
-> END
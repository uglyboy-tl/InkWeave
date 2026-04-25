CONST DETECTIVE = "Poirot"
CONST ASSISTANT = "Hastings"

VAR current_character = DETECTIVE

-> temp_test

=== temp_test ===
Detective: {current_character}
~ temp score = 0
~ score = score + 10
Score: {score}
* [Add more]
    ~ temp bonus = 5
    ~ score = score + bonus
    Score with bonus: {score}
    -> END
* [End]
    -> END
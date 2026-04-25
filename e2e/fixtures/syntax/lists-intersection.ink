LIST CoreValues = strength, courage, compassion, greed, nepotism, self_belief

VAR desiredValues = (strength, courage, compassion, self_belief)
VAR actualValues = (greed, nepotism, self_belief)

-> start

=== start ===
Desired: {desiredValues}
Actual: {actualValues}
* [Check overlap]
    ~ temp overlap = desiredValues ^ actualValues
    Common values: {overlap}
    -> start
* [Check has any common]
    {desiredValues ^ actualValues:
        Has at least one common value.
    - else:
        No common values.
    }
    -> start
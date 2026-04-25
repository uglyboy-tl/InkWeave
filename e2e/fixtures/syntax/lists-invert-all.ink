LIST GuardsOnDuty = Smith, Jones, Carter, Braithwaite

VAR onDuty = (Smith, Jones)

-> start

=== start ===
On duty: {onDuty}
* [Change guard]
    ~ onDuty = LIST_INVERT(onDuty)
    Now on duty: {onDuty}
    -> start
* [List all guards]
    All guards: {LIST_ALL(GuardsOnDuty)}
    -> start
* [Check onDuty count]
    ~ temp count = LIST_COUNT(onDuty)
    Guards on duty: {count}
    -> start
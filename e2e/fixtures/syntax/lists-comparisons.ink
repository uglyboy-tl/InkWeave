LIST Numbers = one, two, three, four, five

VAR listA = (four, five)
VAR listB = (one, two)

-> start

=== start ===
List A: {listA}
List B: {listB}
* [Check A > B]
    {listA > listB:
        A is distinctly bigger than B.
    - else:
        A is not bigger than B.
    }
    -> start
* [Check A >= B]
    {listA >= listB:
        A is never smaller than B.
    - else:
        A might be smaller than B.
    }
    -> start
* [Check B < A]
    {listB < listA:
        B is distinctly smaller than A.
    - else:
        B is not smaller than A.
    }
    -> start
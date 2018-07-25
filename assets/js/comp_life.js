var dataLife = [];

data.forEach(
             function(currentValue, index, arr)
             {
             if (
                 "" != currentValue.pl_bmasse &&
                 "" != currentValue.pl_orbsmax &&
                 "" != currentValue.st_mass
                 ) {
             dataLife.push(currentValue);
             }
             }
             );

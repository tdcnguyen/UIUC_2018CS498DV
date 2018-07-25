data.forEach(
             function(currentValue, index, arr) {
                switch(currentValue.pl_discmethod) {
                    case "Eclipse Timing Variations":
                    currentValue.pl_discmethod = "Transit";
                    break;

                    case "Orbital Brightness Modulation":
                    currentValue.pl_discmethod = "Transit";
                    break;

                    case "Transit Timing Variations":
                    currentValue.pl_discmethod = "Transit";
                    break;

                    case "Astrometry":
                    currentValue.pl_discmethod = "Other";
                    break;

                    case "Pulsar Timing":
                    currentValue.pl_discmethod = "Other";
                    break;

                    case "Pulsation Timing Variations":
                    currentValue.pl_discmethod = "Other";
                    break;
                }
             });

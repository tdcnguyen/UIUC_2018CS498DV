var dataDiscCountObj = {};

data.forEach(
             function(currentValue, index, arr) {
                if (false == (currentValue.pl_disc in dataDiscCountObj)) {
                    dataDiscCountObj[currentValue.pl_disc] = {
             "Total" : 0,
             "Imaging" : 0,
             "Microlensing" : 0,
             "Radial Velocity" : 0,
             "Transit" : 0,
             "Other" : 0,
                    };
                }
             
                dataDiscCountObj[currentValue.pl_disc]["Total"] = dataDiscCountObj[currentValue.pl_disc]["Total"] + 1;

                dataDiscCountObj[currentValue.pl_disc][currentValue.pl_discmethod] = dataDiscCountObj[currentValue.pl_disc][currentValue.pl_discmethod] + 1;
             }
             );

var dataDiscCount = [];
var dataDiscFrac = [];

for (currentKey in dataDiscCountObj) {
    if (dataDiscCountObj.hasOwnProperty(currentKey)) {

        dataDiscCount.push({
                                 "Year" : Number(currentKey),
                                 "Total" : dataDiscCountObj[currentKey]["Total"],
                                 "Imaging" : dataDiscCountObj[currentKey]["Imaging"],
                                 "Microlensing" : dataDiscCountObj[currentKey]["Microlensing"],
                                 "Radial Velocity" : dataDiscCountObj[currentKey]["Radial Velocity"],
                                 "Transit" : dataDiscCountObj[currentKey]["Transit"],
                                 "Other" : dataDiscCountObj[currentKey]["Other"]
                           }
                           );
        
        dataDiscFrac.push({
                                "Year" : Number(currentKey),
                                "Imaging" : dataDiscCountObj[currentKey]["Imaging"] / dataDiscCountObj[currentKey]["Total"],
                                "Microlensing" : dataDiscCountObj[currentKey]["Microlensing"] / dataDiscCountObj[currentKey]["Total"],
                                "Radial Velocity" : dataDiscCountObj[currentKey]["Radial Velocity"] / dataDiscCountObj[currentKey]["Total"],
                                "Transit" : dataDiscCountObj[currentKey]["Transit"] / dataDiscCountObj[currentKey]["Total"],
                                "Other" : dataDiscCountObj[currentKey]["Other"] / dataDiscCountObj[currentKey]["Total"]
                                }
                                );
    }
}

MarkovChain = function() {
    this.N = input[0].length;
    this.mutants = [];

    this.binary = [];
    this.aVal = [];
    this.bVal = [];

    this.dotP = [];
    this.Pdot = []; //LOL
    this.TransM = [];
    this.r = '';

    this.input = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];

}

MarkovChain.prototype.makeBinaryMatrix() {

    for (var i = 0; i <= Math.pow(2, N) - 1; i++) {

        var row = i.toString(2).split('');

        for (var j = 0; j < row.length; j++) {
            row[j] = parseInt(row[j]);
            mutants[i] += row[j];

        }
        while (row.length < N) {
            row.unshift(0);
        }

        binary.push(row); //js uses this to convert to binary for some reason?

    }
}

MarkovChain.prototype.calculate() {




    // aVec[i]: = AdjM.v[i]:
    for (var i = 0; i <= Math.pow(2, N) - 1; i++) {

        dotP = numeric.dot(input, binary[i]);

    }

    // bVec[i]: = AdjM.vprime[i]: i.e gettin it backwards
    for (var i = Math.pow(2, N) - 1; i >= 0; i--) {
        Pdot = numeric.dot(input, binary[i]);
    }


    for (k = 0; k < 8; k++) {
        aVal[k] = [];
        bVal[k] = [];

        for (m = 0; m < 8; m++) {
            aVal[k][m] = 0;
            bVal[k][m] = 0;
        }
    }

    for (var i = 0; i < Math.pow(2, N); i++) {

        for (var j = 0; j < N; j++) {

            if (binary[i][j] == 0) {


                aVal[i][i + Math.pow(2, j) - 1] = dotP[i][j];



            } else if (binary[i][j] == 1) {

                bVal[i][i - Math.pow(2, j) + 1] = Pdot[i][j];


            }

        }
    }

    // for (var i = 0; i <= Math.pow(2, N) - 1; i++) {

    //     for (var j = 0; j <= Math.pow(2, N) - 1; j++) {

    //         if (i < j) {
    //             //TransM[i][j] = r * aVal[i][j] / (N - mutants[i] + r * mutants[i]);
    //         }

    //     }

    // }


}




// for i from 0 to 2^N-1 do
// for j from 0 to 2^N-1 do

// if i<j then
// TransM(i+1,j+1):=r*aVal[i,j]/(N-m[i]+r*m[i]);
// fi;

// if i>j then 
// TransM(i+1,j+1):=bVal[i,j]/(N-m[i]+r*m[i]);
// fi;

// if i=j then
// TransM(i+1,j+1):=(r*(aVec[j].v[j])+bVec[j].vprime[j])/(N-m[i]+r*m[i]);
// fi;

// od;
// od;
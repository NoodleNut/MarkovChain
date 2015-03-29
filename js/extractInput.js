function xyz() {
    document.getElementById("gt-grid").style.display = "none";
    document.getElementById("page2").style.display = "block";
}

function passData() {


    var weights = [];
    var input = document.getElementsByClassName('textbox');
    var R_value = document.getElementById('R_value');

    console.log('r: ' + R_value);


    for (var i = 0; i < Math.pow(5, 2); i++) {

        if (input[i].value != '') {

            weights.push(input[i].value);

        }
    }

    var N = Math.sqrt(weights.length);
    var matrix = [];


    for (var i = 0; i < weights.length; i++) {

        var row = [];

        for (var j = 0; j < N; j++) {

            row.push(weights[i]);
            i++;
        }
        i--;

        matrix.push(row);
    }

    MarkovChain = new MarkovChain(matrix);
    MarkovChain.calculate();
    xyz();
    CreateGraph();
}




MarkovChain = function(matrix) {

    this.mutants = [];

    this.binary = [];
    this.aVal = [];
    this.bVal = [];

    this.dotP = [];
    this.Pdot = []; //LOL
    this.TransM = [];
    this.r = 1;

    this.input = matrix;

    this.N = this.input[0].length;
}


MarkovChain.prototype.calculate = function() {

    this.makeBinaryMatrix();
    this.makeDotProduct();
    this.preTransM();
    this.makeTransM();

    console.log('done');

    // this.test();

}


MarkovChain.prototype.makeBinaryMatrix = function() {

    for (var i = 0; i <= Math.pow(2, this.N) - 1; i++) {

        var row = i.toString(2).split('');

        for (var j = 0; j < row.length; j++) {
            row[j] = parseInt(row[j]);
            this.mutants[i] += row[j];

        }
        while (row.length < this.N) { //might be a bug can't think right now
            row.unshift(0);
        }

        this.binary.push(row); //js uses this to convert to binary for some reason?

    }
}

MarkovChain.prototype.makeDotProduct = function() {

    // aVec[i]: = AdjM.v[i]:
    for (var i = 0; i <= Math.pow(2, this.N) - 1; i++) {

        this.dotP[i] = numeric.dot(this.input, this.binary[i]);
        //debugger;
    }

    // bVec[i]: = AdjM.vprime[i]: i.e gettin it backwards
    for (var i = Math.pow(2, this.N) - 1; i >= 0; i--) {
        this.Pdot[i] = numeric.dot(this.input, this.binary[i]);
    }

}

MarkovChain.prototype.preTransM = function() {

    for (k = 0; k < Math.pow(2, this.N); k++) {
        this.aVal[k] = [];
        this.bVal[k] = [];

        for (m = 0; m < Math.pow(2, this.N); m++) {
            this.aVal[k][m] = 0;
            this.bVal[k][m] = 0;
        }
    }

    for (var i = 0; i < Math.pow(2, this.N); i++) {

        for (var j = 0; j < this.N; j++) {

            if (this.binary[i][j] == 0) {

                this.aVal[i][i + Math.pow(2, j) - 1] = this.dotP[i][j];



            } else if (this.binary[i][j] == 1) {

                this.bVal[i][i - Math.pow(2, j) + 1] = this.Pdot[i][j];


            }

        }
    }

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
MarkovChain.prototype.makeTransM = function() {

    var binary2 = []

    for (var i = 0; i <= Math.pow(2, this.N) - 1; i++) {
        binary2[i] = [];
        this.TransM[i] = [];
    }

    for (var i = 0; i <= Math.pow(2, this.N) - 1; i++) {
        for (var j = 0; j < this.N; j++) {


            binary2[i][j] = 1 - this.binary[i][j];
        }
    }

    for (var i = 0; i <= Math.pow(2, this.N) - 1; i++) {

        for (var j = 0; j <= Math.pow(2, this.N) - 1; j++) {

            if (i < j) {
                this.TransM[i][j] = this.r * this.aVal[i][j] / (this.N - this.mutants[i] + this.r * this.mutants[i]);
            } else if (i == j) {
                this.TransM[i][j] = this.r * (numeric.dot(this.dotP[i], this.binary[i]) + numeric.dot(this.Pdot[i], this.binary[i])) / (this.N - this.mutants[i] + this.r * this.mutants[i]);
            } else {
                this.TransM[i][j] = this.bVal[i][j] / (this.N - this.mutants[i] + this.r * this.mutants[i]);
            }



        }

    }
}
//     #determining fixation probability at inifinity
// V:=Vector(2^N,symbol=x):
// EqnVector:=Multiply(TransM,V);
// x[1]:=0: x[2^N]:=1:


// sols:=solve(eq_list,vars_list):
// assign(sols);
MarkovChain.prototype.SystemSolver = function() {
    var x = [];
    var TrannyM = this.TransM;
    var zerovec = []

    x[0] = 0;
    x[1] = 1;

    for (var i = 0; i <= Math.pow(2, this.N) - 1; i++) {
        TrannyM[i, i] -= 1;
    }
    for (var i = 0; i <= Math.pow(2, this.N) - 1; i++) {
        zerovec[i] = 0;
    }
    x = numeric.solve(TrannyM, zerovec);
}


// rho:=0:
// for i from 2 to 2^N-1 do
// rho:=rho+x[i]/(2^N-2);
// od:
// simplify(rho,size);
MarkovChain.prototype.FixationProb = function() {
    var rho = 0;

    for (var i = 0; i <= Math.pow(2, this.N) - 1; i++) {
        rho = rho + this.x[i] / (Math.pow(2, this.N) - 2);
    }
}

MarkovChain.prototype.test = function() {

    thiswillbreak = numeric.solve([
        [1, 2],
        [3, 4]
    ], [x, 2 * x]);

}
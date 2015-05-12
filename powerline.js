'use strict';


var powerline = function(sum, initArray, lineNum, numsOnLine) {

    //get all possible combinations of lines
    var totalArrays = combine(initArray, numsOnLine);

    var arrays = [];
    //remove lines which the sum are not correct
    for (var i = 0; i < totalArrays.length; i++) {
        if (sumArray(totalArrays[i]) == sum) {
            arrays.push(totalArrays[i]);
        }
    }
    totalArrays = arrays;

    console.log("The array number with sum:", totalArrays.length);

    totalArrays = combine(totalArrays, lineNum);

    console.log("The array combinations:", totalArrays.length);

    var arrays = [];
    for (var i = 0; i < totalArrays.length; i++) {
        if (applyRules(totalArrays[i])) {
            arrays.push(totalArrays[i]);
        }
    }
    totalArrays = arrays;
    console.log(totalArrays.length);
}


var sumArray = function(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
};

var compare = function(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
};

var crossCount = function(arr1, arr2) {
    var arr = [];
    arr = arr1.concat(arr2).sort(compare);
    var cnt = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] == arr[i - 1]) cnt++;
    }
    return cnt;
};


var applyRules = function(arr) {

    var sarrs = [];
    for (var i = 0; i < arr.length; i += 4) {
        var sarr = arr.slice(i, i + 4);
        sarrs.push(sarr);
    }

    var crossCnt = 0;
    var noCrossCnt = 0;

    for (var i = 0; i < sarrs.length - 1; i++) {
        for (var j = i + 1; j < sarrs.length; j++) {
            var cnt = crossCount(sarrs[i], sarrs[j]);
            if (cnt == 1) crossCnt++;
            if (cnt == 0) noCrossCnt++;
        }
    }

    if ((crossCnt == 12 && noCrossCnt == 3)) {
        console.log(sarrs);
    }

    return (crossCnt == 12 && noCrossCnt == 3);
};

var combine = function(arr, num) {
    var r = [];
    (function f(t, a, n) {
        if (n == 0) return r.push(t);
        for (var i = 0, l = a.length; i <= l - n; i++) {
            f(t.concat(a[i]), a.slice(i + 1), n - 1);
        }
    })([], arr, num);
    return r;
};


var initArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
powerline(26, initArray, 6, 4);


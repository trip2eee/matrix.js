/**
 * @file num.js
 * @brief num.js - Matrix library for Javascript.
 * @Author Jongmin Park (trip2eee@gmail.com)
 */

class ndarray{
    constructor(value){
        if(Array.isArray(value)){
            this.shape = [];
            let v = value;
            while(Array.isArray(v)){
                this.shape.push(v.length);
                v = v[0];
            }

            // to access value by ndarray[i].
            for(let i=0; i < value.length; i++){
                this[i] = value[i];
            }
        }else{
            this.shape = [];
        }
        this.value = value;        
    }

    toString(){    
        const shape = this.shape;
        // create ndarray filled with 0s.
        let stack_y = [];
        let stack_d = [];
        let stack_i = [];
        let str = 'ndarray(\n';
        stack_y.push(this.value);
        stack_d.push(0);
        
        let prev_d = 0;
        while(stack_y.length > 0){
            let y = stack_y.pop();
            let d = stack_d.pop();
            let i = stack_i.pop();
            if(d > prev_d){
                str+= '[';
            }else if(d < prev_d){
                str += ']';
            }
            if( i > 0){
                str += ',';
                str += '\n';
            }
            if(shape.length > d+1){
  
                for(let i = (shape[d]-1); i >= 0; i--){                    
                    stack_y.push(y[i]);
                    stack_d.push(d+1);
                    stack_i.push(i);
                }
            }else{
                str += '[';
                for(let i = 0; i < shape[d]; i++){
                    if(i > 0){
                        str += ',';
                    }
                    str += y[i].toFixed(6);
                }
                str += ']';                
            }
            prev_d = d;
        }
        while(prev_d > 1){
            prev_d--;
            str += ']';
        }
        str += ']\n)';

        return str;
    }
};


/**
 * @brief This function returns ndarray with the given array.
 * @param value [in] the input array to be copied to member variable value. 
 */
function array(value){
    return new ndarray(value);
}

function copy(a){
    // Deep copy of ndarray.
    const shape = a.shape;
    let stack_x = [];
    let stack_y = [];
    let stack_d = [];
    let y_copy = Array(shape[0]);
    stack_x.push(a.value);
    stack_y.push(y_copy);
    stack_d.push(0);

    while(stack_y.length > 0){
        let x = stack_x.pop();
        let y = stack_y.pop();
        let d = stack_d.pop();
        if(shape.length > d+1){                
            for(let i = 0; i < shape[d]; i++){
                y[i] = new Array(shape[d+1]);
                stack_x.push(x[i]);
                stack_y.push(y[i]);
                stack_d.push(d+1);
            }
        }else{
            for(let i = 0; i < shape[d]; i++){
                y[i] = x[i];   // copy value.
            }
        }
    }

    let result = new ndarray(y_copy);
    return result;
}

/**
 * @brief This function returns ndarray with given shape filled with 0s.
 * @param shape [in] The shape of ndarray.
 */
function zeros(shape){
    // create ndarray filled with 0s.
    let stack_y = [];
    let stack_d = [];
    let y_zeros = Array(shape[0]);
    stack_y.push(y_zeros);
    stack_d.push(0);

    while(stack_y.length > 0){
        let y = stack_y.pop();
        let d = stack_d.pop();
        if(shape.length > d+1){                
            for(let i = 0; i < shape[d]; i++){
                y[i] = new Array(shape[d+1]);
                stack_y.push(y[i]);
                stack_d.push(d+1);
            }
        }else{
            for(let i = 0; i < shape[d]; i++){
                y[i] = 0;   // fill with 0s.
            }
        }
    }

    let result = new ndarray(y_zeros);
    return result;
}

/**
 * @brief This function returns ndarray with given shape filled with 1s.
 * @param shape [in] The shape of ndarray.
 */
function ones(shape){
    // create ndarray filled with 1s.
    let stack_y = [];
    let stack_d = [];
    let y_ones = Array(shape[0]);
    stack_y.push(y_ones);
    stack_d.push(0);

    while(stack_y.length > 0){
        let y = stack_y.pop();
        let d = stack_d.pop();
        if(shape.length > d+1){                
            for(let i = 0; i < shape[d]; i++){
                y[i] = new Array(shape[d+1]);
                stack_y.push(y[i]);
                stack_d.push(d+1);
            }
        }else{
            for(let i = 0; i < shape[d]; i++){
                y[i] = 1;   // fill with 1s.
            }
        }
    }

    let result = new ndarray(y_ones);
    return result;
}


function is_shape_equal(op1, op2){
    let same_shape = true;
    if(op1.shape.length == op2.shape.length){
        for(let i = 0; i < op1.shape.length; i++){
            if(op1.shape[i] != op2.shape[i]){
                same_shape = false;
                break;
            }
        }
    }else{
        same_shape = false;
    }
    return same_shape;
}

function add(op1, op2){
    // this method adds op1 and op2 and returns the result in ndarray.
    // z = op1 + op2.
    if(op1 instanceof Array){
        op1 = new ndarray(op1);
    }

    if(op2 instanceof Array){
        op2 = new ndarray(op2);
    }

    console.assert(is_shape_equal(op1, op2), 'Shapes do not match.');
    // z[d] = x[d] + y[d]
    let z = zeros(op1.shape);
    let stack_x = [];
    let stack_y = [];
    let stack_z = [];
    let stack_d = [];
    
    stack_x.push(op1.value);
    stack_y.push(op2.value);
    stack_z.push(z.value);
    stack_d.push(0);

    while(stack_z.length > 0){            
        let x = stack_x.pop();
        let y = stack_y.pop();
        let z = stack_z.pop();
        let d = stack_d.pop();
        if(op1.shape.length > d+1){                
            for(let i = 0; i < op1.shape[d]; i++){
                stack_x.push(x[i]);
                stack_y.push(y[i]);
                stack_z.push(z[i]);
                stack_d.push(d+1);
            }
        }else{
            for(let i = 0; i < op1.shape[d]; i++){
                z[i] = x[i] + y[i];     // Add.
            }
        }
    }
    return z;
}

function sub(op1, op2){
    // this method subtracts op2 from op1 and returns the result in ndarray.
    // z = op1 - op2.
    if(op1 instanceof Array){
        op1 = new ndarray(op1);
    }

    if(op2 instanceof Array){
        op2 = new ndarray(op2);
    }

    console.assert(is_shape_equal(op1, op2), 'Shapes do not match.');
    // z[d] = x[d] + y[d]
    let z = zeros(op1.shape);
    let stack_x = [];
    let stack_y = [];
    let stack_z = [];
    let stack_d = [];
    
    stack_x.push(op1.value);
    stack_y.push(op2.value);
    stack_z.push(z.value);
    stack_d.push(0);

    while(stack_z.length > 0){            
        let x = stack_x.pop();
        let y = stack_y.pop();
        let z = stack_z.pop();
        let d = stack_d.pop();
        if(op1.shape.length > d+1){                
            for(let i = 0; i < op1.shape[d]; i++){
                stack_x.push(x[i]);
                stack_y.push(y[i]);
                stack_z.push(z[i]);
                stack_d.push(d+1);
            }
        }else{
            for(let i = 0; i < op1.shape[d]; i++){
                z[i] = x[i] - y[i];     // Subtract.
            }
        }
    }
    return z;
}


function mul(op1, op2){
    // this method performs element wise multiplication of op1 and op2 and returns the result in ndarray.
    // z = op1 * op2.
    if(op1 instanceof Array){
        op1 = new ndarray(op1);
    }

    if(op2 instanceof Array){
        op2 = new ndarray(op2);
    }

    console.assert(is_shape_equal(op1, op2), 'Shapes do not match.');
    // z[d] = x[d] + y[d]
    let z = zeros(op1.shape);
    let stack_x = [];
    let stack_y = [];
    let stack_z = [];
    let stack_d = [];
    
    stack_x.push(op1.value);
    stack_y.push(op2.value);
    stack_z.push(z.value);
    stack_d.push(0);

    while(stack_z.length > 0){            
        let x = stack_x.pop();
        let y = stack_y.pop();
        let z = stack_z.pop();
        let d = stack_d.pop();
        if(op1.shape.length > d+1){                
            for(let i = 0; i < op1.shape[d]; i++){
                stack_x.push(x[i]);
                stack_y.push(y[i]);
                stack_z.push(z[i]);
                stack_d.push(d+1);
            }
        }else{
            for(let i = 0; i < op1.shape[d]; i++){
                z[i] = x[i] * y[i];     // Element wise multiplication.
            }
        }
    }
    return z;
}

function div(op1, op2){
    // this method performs element wise division of op1 and op2 and returns the result in ndarray.
    // z = op1 / op2.
    if(op1 instanceof Array){
        op1 = new ndarray(op1);
    }

    if(op2 instanceof Array){
        op2 = new ndarray(op2);
    }

    console.assert(is_shape_equal(op1, op2), 'Shapes do not match.');
    // z[d] = x[d] + y[d]
    let z = zeros(op1.shape);
    let stack_x = [];
    let stack_y = [];
    let stack_z = [];
    let stack_d = [];
    
    stack_x.push(op1.value);
    stack_y.push(op2.value);
    stack_z.push(z.value);
    stack_d.push(0);

    while(stack_z.length > 0){            
        let x = stack_x.pop();
        let y = stack_y.pop();
        let z = stack_z.pop();
        let d = stack_d.pop();
        if(op1.shape.length > d+1){                
            for(let i = 0; i < op1.shape[d]; i++){
                stack_x.push(x[i]);
                stack_y.push(y[i]);
                stack_z.push(z[i]);
                stack_d.push(d+1);
            }
        }else{
            for(let i = 0; i < op1.shape[d]; i++){
                z[i] = x[i] / y[i];     // Element wise multiplication.
            }
        }
    }
    return z;
}


function matmul(op1, op2){
    // this method performs matrix multiplication of op1 and op2 and returns the result in ndarray.
    // z = op1 * op2.
    if(op1 instanceof Array){
        op1 = new ndarray(op1);
    }

    if(op2 instanceof Array){
        op2 = new ndarray(op2);
    }

    dim_op1 = op1.shape.length;
    dim_op2 = op2.shape.length;

    for(let i = 0; i < dim_op1-2; i++){
        console.assert(op1.shape[i] == op2.shape[i], 'Shapes do not match');    
    }
    console.assert(op1.shape[dim_op1-1] == op2.shape[dim_op2-2], 'Shapes do not match');
    
    // output shape
    // (m1 x n1 x o1) * (m2 x n2 x o2) = (m1 x n1 x o2)
    // m1 == m2
    // o1 == n2
    let shape = op1.shape.slice();  // deep copy.
    shape[shape.length-1] = op2.shape[op2.shape.length-1];

    // z[d] = x[d] + y[d]
    let z = zeros(shape);
    let stack_x = [];
    let stack_y = [];
    let stack_z = [];
    let stack_d = [];

    stack_x.push(op1.value);
    stack_y.push(op2.value);
    stack_z.push(z.value);
    stack_d.push(0);
    
    while(stack_z.length > 0){            
        let x = stack_x.pop();
        let y = stack_y.pop();
        let z = stack_z.pop();
        let d = stack_d.pop();
        if(op1.shape.length > d+2){                
            for(let i = 0; i < op1.shape[d]; i++){
                stack_x.push(x[i]);
                stack_y.push(y[i]);
                stack_z.push(z[i]);
                stack_d.push(d+1);
            }
        }else{
            for(let i = 0; i < op1.shape[d]; i++){
                for(let j = 0; j < op2.shape[d+1]; j++){
                    for(let k = 0; k < op1.shape[d+1]; k++){
                        z[i][j] += x[i][k] * y[k][j];
                    }                    
                }                
            }
        }
    }
    return z;
}

/**
 * @brief Return a 2-D array with ones on the diagnoal and zeros elsewhere.
 * @param N (int) Number of rows in the output.
 * @param M (int, optional) Number of columns in the output. If null, defaults to N.
 */
function eye(N, M=null){
    let shape;
    if(M === null){
        shape = [N, N];
    }else{
        shape = [N, M];
    }

    let z = zeros(shape);
    for(let i = 0; i < N; i++){
        z.value[i][i] = 1;
    }
    return z;
}

function test_array_equal(x, y, index, eps){
    let equal = true;
    if(Array.isArray(x) && Array.isArray(y)){
        for(let i = 0; i < x.length; i++){
            let new_index = index.slice();
            new_index.push(i);
            equal = test_array_equal(x[i], y[i], new_index, eps);
        }
    }else{
        // if scalar
        if(Math.abs(x - y) > eps){
            equal = false;  // not equal.
            // print error message.
            let msg = x + ' != ' + y + ' at (';
            for(let i = 0; i < index.length; i++){
                if(i > 0){
                    msg += ', ';
                }
                msg += index[i];
            }
            msg += ')';
            console.log(msg)
        }
    }
    return equal;
}

function assertArrayEqual(x, y){
    if(x instanceof ndarray == false){
        x = array(x);
    }
    if(y instanceof ndarray == false){
        y = array(y);
    }

    let same_shape = true;
    if(x.shape.length == y.shape.length){
        for(let i = 0; i < x.shape.length; i++){
            if(x.shape[i] != y.shape[i]){
                same_shape = false;
                break;
            }
        }
    }else{
        same_shape = false;
    }
    if(false == same_shape){
        throw 'Shapes of the two arrays do not match.';
    }

    // test for value.
    index = [];
    if(false == test_array_equal(x.value, y.value, index, 0.0)){
        throw 'The two arrays are not equal.';
    }
}

function assertArrayNear(x, y, eps){
    if(x instanceof ndarray == false){
        x = array(x);
    }
    if(y instanceof ndarray == false){
        y = array(y);
    }

    let same_shape = true;
    if(x.shape.length == y.shape.length){
        for(let i = 0; i < x.shape.length; i++){
            if(x.shape[i] != y.shape[i]){
                same_shape = false;
                break;
            }
        }
    }else{
        same_shape = false;
    }
    if(false == same_shape){
        throw 'Shapes of the two arrays do not match.';
    }

    // test for value.
    index = [];
    if(false == test_array_equal(x.value, y.value, index, eps)){
        throw 'The two arrays are not equal.';
    }
}

var linalg = require('./linalg.js');
module.exports = {array, zeros, ones, copy, eye,
    add, sub, mul, div, matmul,
    linalg,
    assertArrayEqual, assertArrayNear};



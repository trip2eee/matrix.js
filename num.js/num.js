/**
 * @file num.js
 * @brief num.js - Matrix library for Javascript.
 * @Author Jongmin Park
 */

class ndarray{
    constructor(data){
        if(Array.isArray(data)){
            this.shape = [];
            let v = data;
            while(Array.isArray(v)){
                this.shape.push(v.length);
                v = v[0];
            }

            // to access value by ndarray[i].
            for(let i=0; i < data.length; i++){
                this[i] = data[i];
            }
        }else{
            this.shape = [];
        }
        this.data = data;

        Object.defineProperty(this, 'T', {
            get: function() {
                return this.transpose();
            }.bind(this)
        });
    }
    
    /**
     * @brief This method returns a copy of the array collapsed into one dimension.
     * @return ndarray. A copy of the input array, flattened to one dimension.
     */
    flatten(){
        let len = 1;
        for(let i = 0; i < this.shape.length; i++){
            len *= this.shape[i];
        }
        let y_flat = [];
        let stack_x = [this.data];
        let stack_d = [0];
        while(stack_x.length > 0){
            let x = stack_x.pop();
            const d = stack_d.pop();
            if(d < (this.shape.length-1)){
                for(let i = (x.length-1); i >= 0; i--){
                    stack_x.push(x[i]);
                    stack_d.push(d+1);
                }
            }else{
                for(let i = 0; i < x.length; i++){
                    y_flat.push(x[i]);
                }
            }
        }
        let z = new ndarray(y_flat);
        return z;
    }

    /**
     * @brief This method returns an array containing the same data with a new shape.
     * @param shape [in] a new shape.
     */
    reshape(shape){
        let x_flat = this.flatten();
        let idx = 0;

        let z = zeros(shape);
        let stack_x = [z.data];
        let stack_d = [0];
        while(stack_x.length > 0){
            let x = stack_x.pop();
            const d = stack_d.pop();
            if(d < (shape.length-1)){
                for(let i = (x.length-1); i >= 0; i--){
                    stack_x.push(x[i]);
                    stack_d.push(d+1);
                }
            }else{
                for(let i = 0; i < x.length; i++){
                    x[i] = x_flat[idx];
                    idx++;
                }
            }
        }
        return z;
    }

    /**
     * @brief This method reverses or permutes the axes of an array; returns the modified array.
     * @param axes (null, array of integers) null or no argument: reverses the order of the axes. For 2D array, this method gives the matrix transpose.
     *                                       list of integers: i in the j-th place in the list means a's i-th axis becomes a.transpose()'s j-th axis.
     * @returns The array itself with its axes permuted.
     */
    transpose(axes=null){
        if(null == axes){
            axes = [];
            for(let i = this.shape.length-1; i >= 0; i--){
                axes.push(i);
            }
        }
        let shape = Array(this.shape.length);
        for(let i = 0; i < shape.length; i++){
            shape[i] = this.shape[axes[i]];
        }
        let z = zeros(shape);

        let stack_y = [z.data];
        let stack_d = [0];
        let src = new Array(this.shape.length);
        let stack_src = [src];

        while(stack_y.length > 0){
            let y = stack_y.pop();
            let src = stack_src.pop();
            const d = stack_d.pop();

            if(d < (shape.length-1)){
                for(let i = (y.length-1); i >= 0; i--){
                    let src1 = src.slice();
                    src1[axes[d]] = i;

                    stack_y.push(y[i]);
                    stack_d.push(d+1);
                    stack_src.push(src1);
                }
            }else{
                for(let i = 0; i < y.length; i++){
                    src[axes[d]] = i;
                    let val = this.data;
                    for(let j = 0; j < shape.length; j++){
                        val = val[src[j]];
                    }
                    y[i] = val;
                }
            }
        }

        return z;
    }

    toString(){    
        const shape = this.shape;
        // create ndarray filled with 0s.
        let str = 'ndarray(\n';
        let stack_y = [this.data];
        let stack_d = [0];
        let stack_i = [0];
        
        let prev_d = 0;
        while(stack_y.length > 0){
            const y = stack_y.pop();
            const d = stack_d.pop();
            const i = stack_i.pop();
            if(d > prev_d){
                str+= '[';
            }else if(d < prev_d){
                str += ']';
            }
            if( i > 0){
                str += ',';
                str += '\n';
            }
            if(d < (shape.length-1)){
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
 * @param a [in] the input array to be copied to member variable value. 
 */
function array(a){
    return new ndarray(a);
}

function copy(a){
    // Deep copy of ndarray.
    const shape = a.shape;
    let y_copy = Array(shape[0]);
    let stack_x = [a.data];
    let stack_y = [y_copy];
    let stack_d = [0];
    
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
    let y_zeros = Array(shape[0]);
    let stack_y = [y_zeros];
    let stack_d = [0];    
    
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
    let y_ones = Array(shape[0]);
    let stack_y = [y_ones];
    let stack_d = [0];    
    
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

function array_operation1(op1, operation){
    // array operation with one operand.
    // y = operation(op1)
    if(op1 instanceof Array){
        op1 = new ndarray(op1);
    }

    // z[d] = x[d] + y[d]
    let z = zeros(op1.shape);
    let stack_x = [op1.data];
    let stack_z = [z.data];
    let stack_d = [0];
    
    while(stack_z.length > 0){            
        const x = stack_x.pop();
        let z = stack_z.pop();
        const d = stack_d.pop();
        if(op1.shape.length > d+1){                
            for(let i = 0; i < op1.shape[d]; i++){
                stack_x.push(x[i]);
                stack_z.push(z[i]);
                stack_d.push(d+1);
            }
        }else{
            for(let i = 0; i < op1.shape[d]; i++){
                z[i] = operation(x[i]);
            }
        }
    }
    return z;
}

function array_operation2(op1, op2, operation){
    // array operation with two operands.
    // y = operation(op1, op2)
    if(op1 instanceof Array){
        op1 = new ndarray(op1);
    }

    if(op2 instanceof Array){
        op2 = new ndarray(op2);
    }

    console.assert(is_shape_equal(op1, op2), 'Shapes do not match.');
    // z[d] = x[d] + y[d]
    let z = zeros(op1.shape);
    let stack_x = [op1.data];
    let stack_y = [op2.data];
    let stack_z = [z.data];
    let stack_d = [0];
    
    while(stack_z.length > 0){            
        const x = stack_x.pop();
        const y = stack_y.pop();
        let z = stack_z.pop();
        const d = stack_d.pop();
        if(op1.shape.length > d+1){                
            for(let i = 0; i < op1.shape[d]; i++){
                stack_x.push(x[i]);
                stack_y.push(y[i]);
                stack_z.push(z[i]);
                stack_d.push(d+1);
            }
        }else{
            for(let i = 0; i < op1.shape[d]; i++){
                z[i] = operation(x[i], y[i]);     // Add.
            }
        }
    }
    return z;
}


function add(op1, op2){
    // this method adds op1 and op2 and returns the result in ndarray.
    // z = op1 + op2.
    return array_operation2(op1, op2, function (x, y) {return x + y;});
}

function sub(op1, op2){
    // this method subtracts op2 from op1 and returns the result in ndarray.
    // z = op1 - op2.
    return array_operation2(op1, op2, function (x, y) {return x - y;});
}

function mul(op1, op2){
    // this method performs element wise multiplication of op1 and op2 and returns the result in ndarray.
    // z = op1 * op2.
    return array_operation2(op1, op2, function (x, y) {return x * y;});
}

function div(op1, op2){
    // this method performs element wise division of op1 and op2 and returns the result in ndarray.
    // z = op1 / op2.
    return array_operation2(op1, op2, function (x, y) {return x / y;});
}

function sin(x){
    return array_operation1(x, function (x) { return Math.sin(x);});
}

function cos(x){
    return array_operation1(x, function (x) { return Math.cos(x);});
}

function tan(x){
    return array_operation1(x, function (x) { return Math.tan(x);});
}

function arcsin(x){
    return array_operation1(x, function (x) { return Math.asin(x);});
}

function arccos(x){
    return array_operation1(x, function (x) { return Math.acos(x);});
}

function arctan(x){
    return array_operation1(x, function (x) { return Math.atan(x);});
}

function arctan2(x1, x2){
    return array_operation2(x1, x2, function (x, y) { return Math.atan2(x, y);});
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
    let stack_x = [op1.data];
    let stack_y = [op2.data];
    let stack_z = [z.data];
    let stack_d = [0];

    while(stack_z.length > 0){            
        const x = stack_x.pop();
        const y = stack_y.pop();
        let z = stack_z.pop();
        const d = stack_d.pop();
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
        z.data[i][i] = 1;
    }
    return z;
}

function test_array_equal(x, y, index, eps){
    let equal = true;
    if(Array.isArray(x) && Array.isArray(y)){
        for(let i = 0; i < x.length; i++){
            let new_index = index.slice();
            new_index.push(i);
            if(false == test_array_equal(x[i], y[i], new_index, eps)){
                equal = false;
            }
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
    if(false == test_array_equal(x.data, y.data, index, 0.0)){
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
    if(false == test_array_equal(x.data, y.data, index, eps)){
        throw 'The two arrays are not equal.';
    }
}

function reshape(a, shape){
    return a.reshape(shape);
}

function transpose(a, axes=null){
    return a.transpose(axes);
}

class matrix extends ndarray
{
    constructor(a, dtype=null, copy=true){
        // check array dimension.
        let dim = 0
        let shape = [];
        let t = a;
        while(Array.isArray(t)){
            dim ++;
            shape.push(t.length);
            t = t[0]; 
        }
        console.assert(dim==2, 'Matrix has to be 2-dimensional array');

        if(true == copy){
            let y_copy = Array(shape[0]);
            let stack_x = [a];
            let stack_y = [y_copy];
            let stack_d = [0];
            
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
            super(y_copy);
        }else{
            super(a);
        }        
    }
};


var linalg = require('./linalg.js');
module.exports = {array, zeros, ones, copy, eye, matrix,
    add, sub, mul, div, matmul, sin, cos, tan, arcsin, arccos, arctan, arctan2,
    reshape, transpose, 
    linalg,
    assertArrayEqual, assertArrayNear};



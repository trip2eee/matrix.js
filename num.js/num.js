/**
 * @file num.js
 * @brief num.js - Matrix library for Javascript.
 * @Author Jongmin Park
 */

// Constants
const pi = 3.141592653589793;

// Implmentations
class ndarray{
    constructor(data){
        if(Array.isArray(data)){
            this.shape = [];
            this.strides = [];

            let v = data;
            while(Array.isArray(v)){
                this.shape.push(v.length);
                this.strides.push(1);
                v = v[0];
            }
            
            // compute stride.
            for(let i = 0; i < this.shape.length; i++){
                for(let j = i+1; j < this.shape.length; j++){
                    this.strides[i] *= this.shape[j];
                }                
            }
            // to access value by ndarray[i].
            for(let i=0; i < data.length; i++){
                this[i] = data[i];
            }
        }else{
            console.error('input data has to be an array.');
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

        // if 1-D array
        if(z.shape.length == 1){
            for(let i = 0; i < z.data.length; i++){
                z[i] = z.data[i];
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

    max(axis=null){
        if(null === axis){
            axis = this.shape.length-1;
        }
        return array_operation_axis(this, axis, function (x, y){ return (x > y) ? x : y;});
    }

    min(axis=null){
        if(null === axis){
            axis = this.shape.length-1;
        }
        return array_operation_axis(this, axis, function (x, y){ return (x < y) ? x : y;});
    }

    mean(axis=null){
        if(null === axis){
            axis = this.shape.length-1;
        }
        let z = array_operation_axis(this, axis, function (x, y){ return (x + y);});
        const denom = this.shape[axis];
        return array_operation1(z, function(x){ return x / denom;});
    }

    argmax(axis=null){
        if(null === axis){
            axis = this.shape.length-1;
        }
        return array_operation_axis_arg(this, axis, function (x, y){ return (x < y);});
    }

    argmin(axis=null){
        if(null === axis){
            axis = this.shape.length-1;
        }
        return array_operation_axis_arg(this, axis, function (x, y){ return (x > y);});
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
        while(prev_d > 0){
            prev_d--;
            str += ']';
        }
        str += '\n)';

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

    let x = op1.flatten();
    let z = zeros(x.shape);

    for(let i = 0; i < x.shape[0]; i++){
        z.data[i] = operation(x[i]);
    }

    z = z.reshape(op1.shape);
    // if 1-D array
    if(z.shape.length == 1){
        for(let i = 0; i < z.data.length; i++){
            z[i] = z.data[i];
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

    if(typeof op1 === 'number' && op2 instanceof ndarray){
        const value = op1;
        op1 = array_operation1(new ones(op2.shape), (x) => {return value;});
    }else if(op1 instanceof ndarray && typeof op2 === 'number'){
        const value = op2;
        op2 = array_operation1(new ones(op1.shape), (x) => {return value;});
    }

    console.assert(is_shape_equal(op1, op2), 'Shapes do not match.');

    let x = op1.flatten();
    let y = op2.flatten();
    let z = zeros(x.shape);

    for(let i = 0; i < x.shape[0]; i++){
        z.data[i] = operation(x[i], y[i]);
    }

    z = z.reshape(op1.shape);
    // if 1-D array
    if(z.shape.length == 1){
        for(let i = 0; i < z.data.length; i++){
            z[i] = z.data[i];
        }
    }

    return z;
}

/**
 * @brief This function performs a numerical operation along an axis.
 * @param op1 [in] The array in which a numerical operation is performed.
 * @param axis [in] The axis along which the numerical operation is performed.
 * @param operation [in] The numerical operation to be performed.
 * @returns The numerical operation result.
 */
function array_operation_axis(op1, axis, operation){
    // array operation along an axis.
    // y = operation(op1, op2)
    if(op1 instanceof Array){
        op1 = new ndarray(op1);
    }

    let new_shape = [];
    let len_y = 1;
    for(let i = 0; i < op1.shape.length; i++){
        if(i != axis){
            new_shape.push(op1.shape[i]);
            len_y *= op1.shape[i];    
        }
    }
    
    let flat_x = op1.flatten();
    let flat_y = new ndarray(Array(len_y));
    let idx_offset = 0;
    for(let i = 0; i < flat_x.shape[0]; i++){

        flat_y.data[i] = flat_x.data[idx_offset];
        for(let j = 1; j < op1.shape[axis]; j++){
            flat_y.data[i] = operation(flat_x.data[idx_offset + (j * op1.strides[axis])], flat_y.data[i]);
        }
        
        if(axis == (op1.shape.length-1)){
            idx_offset += op1.shape[axis];
        }else{
            idx_offset += 1;
            if((idx_offset % op1.strides[axis]) == 0){
                idx_offset += op1.strides[axis];
            }
        }
    }

    let y = flat_y.reshape(new_shape);    
    return y
}

function array_operation_axis_arg(op1, axis, operation){
    // array operation along an axis.
    // y = operation(op1, op2)
    if(op1 instanceof Array){
        op1 = new ndarray(op1);
    }

    let new_shape = [];
    let len_y = 1;
    for(let i = 0; i < op1.shape.length; i++){
        if(i != axis){
            new_shape.push(op1.shape[i]);
            len_y *= op1.shape[i];    
        }
    }
    
    let flat_x = op1.flatten();
    let flat_y = new ndarray(Array(len_y));
    let flat_arg = new ndarray(Array(len_y));
    for(let i = 0; i < flat_y.shape[0]; i++){
        flat_arg.data[i] = 0;
    }

    let idx_offset = 0;
    for(let i = 0; i < flat_x.shape[0]; i++){
        flat_y.data[i] = flat_x.data[idx_offset];

        for(let j = 1; j < op1.shape[axis]; j++){
            if(operation(flat_y.data[i], flat_x.data[idx_offset + (j * op1.strides[axis])])){
                flat_y.data[i] = flat_x.data[idx_offset + (j * op1.strides[axis])];
                flat_arg.data[i] = j;
            }
            
        }
        
        if(axis == (op1.shape.length-1)){
            idx_offset += op1.shape[axis];
        }else{
            idx_offset += 1;
            if((idx_offset % op1.strides[axis]) == 0){
                idx_offset += op1.strides[axis];
            }
        }
    }

    let arg = flat_arg.reshape(new_shape);    
    return arg
}


function add(op1, op2){
    // this method adds op1 and op2 and returns the result in ndarray.
    // z = op1 + op2.
    return array_operation2(op1, op2, (x, y) => {return x + y;});
}

function sub(op1, op2){
    // this method subtracts op2 from op1 and returns the result in ndarray.
    // z = op1 - op2.
    return array_operation2(op1, op2, (x, y) => {return x - y;});
}

function mul(op1, op2){
    // this method performs element wise multiplication of op1 and op2 and returns the result in ndarray.
    // z = op1 * op2.
    return array_operation2(op1, op2, (x, y) => {return x * y;});
}

function div(op1, op2){
    // this method performs element wise division of op1 and op2 and returns the result in ndarray.
    // z = op1 / op2.
    return array_operation2(op1, op2, (x, y) => {return x / y;});
}

function sin(x){
    return array_operation1(x, (x) => { return Math.sin(x);});
}

function cos(x){
    return array_operation1(x, (x) => { return Math.cos(x);});
}

function tan(x){
    return array_operation1(x, (x) => { return Math.tan(x);});
}

function arcsin(x){
    return array_operation1(x, (x) => { return Math.asin(x);});
}

function arccos(x){
    return array_operation1(x, (x) => { return Math.acos(x);});
}

function arctan(x){
    return array_operation1(x, (x) => { return Math.atan(x);});
}

function arctan2(x1, x2){
    return array_operation2(x1, x2, (x, y) => { return Math.atan2(x, y);});
}

function dot(op1, op2){
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

    console.assert(op1.shape[dim_op1-1] == op2.shape[dim_op2-2], 'Shapes do not match');
    
    // output shape
    // (m1 x n1 x o1) * (m2 x n2 x o2) = (m1 x n1 x o2)
    // m1 == m2
    // o1 == n2
    let shape = op1.shape.slice();  // deep copy.
    shape[shape.length-1] = op2.shape[op2.shape.length-1];

    let strides = [];
    let len_y = 1;
    for(let i = 0; i < shape.length; i++){
        len_y *= shape[i];
        let s = 1;
        for(let j = i+1; j < shape.length; j++){
            s *= shape[j];
        }
        strides.push(s);
    }
    
    x1 = op1.flatten();
    x2 = op2.flatten();
    y = Array(len_y);
    
    const dim_y = strides.length;
    const dim_x1 = op1.shape.length;
    const dim_x2 = op2.shape.length;

    const stride_y = strides[dim_y-2];
    const stride_x1 = op1.strides[dim_x1-2];
    const stride_x2 = op2.strides[dim_x2-2];
    
    let i = 0;
    while((i * stride_y) < len_y){
        for(let j = 0; j < shape[dim_y-1]; j++){
            y[(i * stride_y) + j] = 0;
            for(let k = 0; k < op1.shape[dim_x1-1]; k++){
                y[(i * stride_y) + j] += x1.data[(i * stride_x1) + k] * x2.data[(k * stride_x2) + j];
            }
        }
        i++;
    }

    return array(y).reshape(shape);
}

function matmul(op1, op2) {return dot(op1, op2);}

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
            let msg = x + ' != ' + y + ' by ' + Math.abs(x-y) + ' at (';
            for(let i = 0; i < index.length; i++){
                if(i > 0){
                    msg += ', ';
                }
                msg += index[i];
            }
            msg += ')';
            console.log(msg)
        }else if((x === undefined) || isNaN(x)){
            equal = false;  // not equal.
            // print error message.
            let msg = x + ' is invalid at (';
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

function assertArrayNear(x, y, eps=0){
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

function min(a, axis=null){
    return a.min(axis);
}

function max(a, axis=null){
    return a.max(axis);
}

function mean(a, axis=null){
    return a.mean(axis);
}

function argmin(a, axis=null){
    return a.argmin(axis);
}

function argmax(a, axis=null){
    return a.argmax(axis);
}

/**
 * This function removes axes of length one from a.
 * @param a (in) input array.
 * @param axis (None or int or tuples of ints, optional) Selects a subset of the entries of length on in the shape.
 */
function squeeze(a, axis=null){
    let new_shape = a.shape.slice();
    if(Array.isArray(axis)){
        // sort in decreasing order.
        axis.sort((a, b) => {return b - a;});
        for(let i = 0; i < new_shape.length; i++){
            console.assert(1 == new_shape[axis[i]], 'The size of axis to be removed has to be 1.');
            new_shape.splice(axis[i], 1);
        }
    }else{
        console.assert(1 == new_shape[axis], 'The size of axis to be removed has to be 1.');
        new_shape.splice(axis, 1);
    }
    return a.reshape(new_shape);
}

/**
 * This function expands the shape of an array.
 * @param a (in) input array.
 * @param axis (int or tuple of ints) Position in the expanded axes where the new axis (or axes) is placed.
 */
function expand_dims(a, axis=null){
    let new_shape = a.shape.slice();
    if(Array.isArray(axis)){
        // sort in increasing order.
        axis.sort((a, b) => {return a - b;});
        for(let i = 0; i < axis.length; i++){
            new_shape.splice(axis[i], 0, 1);
        }
    }else{        
        new_shape.splice(axis, 0, 1);
    }
    return a.reshape(new_shape);
}

function matrix(a, dtype=null, copy=true) {
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
        return new ndarray(y_copy);
    }else{
        return new ndarray(a);
    }        
}

var linalg = require('./linalg.js');
module.exports = {pi,
    array, zeros, ones, copy, eye, matrix,
    add, sub, mul, div, dot, matmul, sin, cos, tan, arcsin, arccos, arctan, arctan2,
    reshape, transpose, min, max, mean, argmin, argmax, squeeze, expand_dims,
    linalg,
    assertArrayEqual, assertArrayNear};



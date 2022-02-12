/**
 * @file ut_ndarray.js
 * @brief Multidimensional array unit test.
 * @Author Jongmin Park
 */

var nj = require('../num.js/num');
var ut = require('../htest.js/htest');

class ut_numjs extends ut.htest
{
    SetUp(){
        
    }
    TearDown(){

    }

    test_array(){
        let a = nj.array([[1, 2, 3],
                          [4, 5, 6]]);
        nj.assertArrayEqual(a, [[1, 2, 3], [4, 5, 6]]);
    }

    test_zeros(){
        let a = nj.zeros([3, 2]);
        nj.assertArrayEqual(a.shape, [3, 2]);
        nj.assertArrayEqual(a, [[0, 0], [0, 0], [0, 0]]);
    }

    test_ones(){
        let a = nj.ones([2, 2, 2]);
        nj.assertArrayEqual(a.shape, [2, 2, 2]);
        nj.assertArrayEqual(a, [[[1, 1], [1, 1]], [[1, 1], [1, 1]]]);
    }

    test_flatten(){
        const a1 = [[[1], [2]], [[3], [4]]];
        let b1 = nj.array(a1);
        let c1 = b1.flatten();

        const a2 = [[1, 2], [3, 4]];
        let b2 = nj.array(a2);
        let c2 = b2.flatten();

        nj.assertArrayEqual(c1, [1, 2, 3, 4])
        nj.assertArrayEqual(c2, [1, 2, 3, 4])
    }

    test_reshape(){
        const a = [[[1], [2]], [[3], [4]], [[5], [6]]];
        const b = nj.array(a);
        let c1 = b.reshape([2, 3]);
        let c2 = nj.reshape(b, [6]);

        nj.assertArrayEqual(c1, [[1, 2, 3], [4, 5, 6]]);
        nj.assertArrayEqual(c2, [1, 2, 3, 4, 5, 6]);
    }

    test_add(){
        let a1 = nj.array([[1, 2], [3, 4]]);
        let b1 = nj.array([[1, 1], [2, 2]]); 
        let c1 = nj.add(a1, b1);
        nj.assertArrayEqual(c1, [[2, 3], [5, 6]]);

        let a2 = nj.array([1, 2, 3, 4]);
        let b2 = nj.array([1, 1, 2, 2]);
        let c2 = nj.add(a2, b2);
        nj.assertArrayEqual(c2, [2, 3, 5, 6]);
    }

    test_sub(){
        let a = nj.array([[1, 2], [3, 4]]);
        let b = nj.array([[1, 1], [2, 2]]);        
        let c = nj.sub(a, b);
        nj.assertArrayEqual(c, [[0, 1], [1, 2]]);
    }

    test_mul(){
        let a = nj.array([[1, 2], [3, 4]]);
        let b = nj.array([[1, 1], [2, 2]]);        
        let c1 = nj.mul(a, b);
        nj.assertArrayEqual(c1, [[1, 2], [6, 8]]);

        // test broad casting
        let c2 = nj.mul(a, 2);
        nj.assertArrayEqual(c2, [[2, 4], [6, 8]]);

        let c3 = nj.mul(2, a);
        nj.assertArrayEqual(c3, [[2, 4], [6, 8]]);
    }

    test_div(){
        let a = nj.array([[1, 2], [3, 4]]);
        let b = nj.array([[1, 1], [2, 2]]);        
        let c = nj.div(a, b);
        nj.assertArrayEqual(c, [[1, 2], [1.5, 2]]);
    }

    test_dot(){
        // (2,2,2,2)
        let a = nj.array([[[[0, 1],
                            [2, 3]],
                           [[-3, 4],
                            [5, 6]]],
                          [[[ 10, 11],
                            [12, 13]], 
                           [[-13, 14],
                            [15, 14]]]]);
        // (2,2)
        let b = nj.array([[1, 2], 
                          [3, 4]]);
        let c = nj.dot(a, b);
        nj.assertArrayEqual(c, [[[[ 3,  4],
                                  [11, 16]],
                                 [[ 9, 10],
                                  [23, 34]]],                              
                                [[[43, 64],
                                  [51, 76]],
                                 [[29, 30],
                                  [57, 86]]]]);        
    }

    test_matmul(){
        let a = nj.array([[1, 2, 3], [4, 5, 6]]);
        let b = nj.array([[1, 2], [3, 4], [5, 6]]);
        let c = nj.matmul(a, b);
        nj.assertArrayEqual(c, [[22, 28], [49, 64]]);
    }

    test_eye(){
        let a = nj.eye(2);
        nj.assertArrayEqual(a, [[1, 0], [0, 1]]);

        let b = nj.eye(2, 3);
        nj.assertArrayEqual(b, [[1, 0, 0], [0, 1, 0]]);
    }

    test_transpose(){
        let a1 = nj.array([[[1], [2], [3]], [[4], [5], [6]]]);
        let b1 = a1.T;      // equivalent to a1.transpose();
        nj.assertArrayEqual(b1, [[[1, 4], [2, 5], [3, 6]]]);

        let a2 = nj.array([[[1], [2], [3]], [[4], [5], [6]]]);
        let b2 = a2.transpose([0, 2, 1]);
        nj.assertArrayEqual(b2, [[[1, 2, 3]], [[4, 5, 6]]]);

        let a3 = nj.array([[[1, 2], [3, 4], [5, 6]], 
                           [[7, 8], [9, 10], [11, 12]]]);
                           
        let b3 = a3.transpose([1, 2, 0]);
        nj.assertArrayEqual(b3, [[[1,  7], [2,  8]],
                                 [[3,  9], [4, 10]], 
                                 [[5, 11], [6, 12]]]);

        let b4 = nj.transpose(a3, [0, 2, 1]);
        nj.assertArrayEqual(b4, [[[1,  3,  5],
                                  [2,  4,  6]],
                                 [[7,  9, 11],
                                  [8, 10, 12]]]);
    }

    test_toString(){
        let a = nj.zeros([2, 2, 1]);

        const str = a.toString();
        const target = 'ndarray(\n[[[0.000000],\n[0.000000]],\n[[0.000000],\n[0.000000]]]\n)';
        this.expectEqual(str, target);
    }

    test_linalg_inv(){
        let a = nj.array([[1, 2], [3, 4]]);
        let b = nj.linalg.inv(a);
        let c = nj.matmul(a, b);

        nj.assertArrayNear(c, [[1, 0], [0, 1]], 1e-6);
        console.log('' + c);
    }

    test_linalg_solve(){
        // 2nd order polynomial fitting test.
        const c0 = 1.0;
        const c1 = 0.01;
        const c2 = 0.001;
        const N = 3;
        let a = nj.zeros([N, 3]);
        let b = nj.zeros([N, 1]);

        for(let i = 0; i < N; i++){
            const x = i*10;
            a[i][0] = 1.0;
            a[i][1] = x;
            a[i][2] = Math.pow(x,2);
            
            b[i][0] = c0 + (c1*x) + (c2*Math.pow(x,2));
        }

        const x = nj.linalg.solve(a, b);

        nj.assertArrayNear(x, [[c0], [c1], [c2]], 1e-6);
    }

    test_linalg_solve2(){
        // 2nd order polynomial fitting test.
        const c0 = 1.0;
        const c1 = 0.01;
        const c2 = 0.001;
        const N = 10;

        let a = nj.zeros([N, 3]);
        let b = nj.zeros([N, 1]);

        for(let i = 0; i < N; i++){
            const x = i*10;
            a[i][0] = 1.0;
            a[i][1] = x;
            a[i][2] = Math.pow(x,2);
            
            b[i][0] = c0 + (c1*x) + (c2*Math.pow(x,2));
        }

        const x = nj.linalg.solve(nj.matmul(a.T, a), nj.matmul(a.T, b));

        nj.assertArrayNear(x, [[c0], [c1], [c2]], 1e-6);
    }

    test_matrix(){
        let a = nj.matrix([[0, 1], [2, 3]]);
        nj.assertArrayEqual(a, [[0, 1], [2, 3]]);
    }

    test_sin(){
        const x = [1, 2, 3];
        let a = nj.array(x);
        let y = nj.sin(a);

        for(let i = 0; i < x.length; i++){
            this.expectEqual(y[i], Math.sin(x[i]));
        }
    }

    test_max(){
        let a = nj.array([[[ 0, 1, 2, 3], 
                           [-3, 4, 5, 6]],                
                          [[ 10, 11, 12, 13], 
                           [-13, 14, 15, 16]]]);

        let b1 = a.max();
        nj.assertArrayEqual(b1, [[3, 6], [13, 16]]);

        let b2 = a.max(1);
        nj.assertArrayEqual(b2, [[0, 4, 5, 6], [10, 14, 15, 16]]);

        let b3 = a.max(0);
        nj.assertArrayEqual(b3, [[ 10, 11, 12, 13], 
                                 [ -3, 14, 15, 16]]);
    }

    test_argmax(){
        let a = nj.array([[[ 0, 1, 2], 
                           [-3, 4, 5]],                
                          [[ 10, 11, 12], 
                           [-13, 14, 15]]]);

        let b1 = a.argmax();
        nj.assertArrayEqual(b1, [[2, 2], [2, 2]]);
        
        let b2 = a.argmax(1);
        nj.assertArrayEqual(b2, [[0, 1, 1], [0, 1, 1]]);

        let b3 = a.argmax(0);
        nj.assertArrayEqual(b3, [[1, 1, 1], 
                                 [0, 1, 1]]);
    }

    test_min(){
        let a = nj.array([[[[0, 1],
                            [2, 3]], 
                           [[-3, 4],
                            [5, 6]]],
                          [[[ 10, 11],
                            [12, 13]], 
                           [[-13, 14],
                            [15, 14]]]]);

        let b1 = a.min(3);
        nj.assertArrayEqual(b1, [[[  0, 2],
                                  [ -3, 5]],
                                 [[ 10, 12],
                                  [-13, 14]]]);

        let b2 = a.min(2);
        nj.assertArrayEqual(b2, [[[  0, 1],
                                  [ -3, 4]],
                                 [[ 10, 11],
                                  [-13, 14]]]);
                                    
        let b3 = a.min(1);
        nj.assertArrayEqual(b3, [[[ -3, 1],
                                  [  2, 3]],
                                 [[-13, 11],
                                  [ 12, 13]]]);

        let b4 = a.min(0);
        nj.assertArrayEqual(b4, [[[  0, 1],
                                  [  2, 3]],
                                 [[-13, 4],
                                  [  5, 6]]]);
    }

    test_argmin(){
        let a = nj.array([[[[0, 1],
                            [2, 3]], 
                           [[-3, 4],
                            [5, 6]]],
                          [[[ 10, 11],
                            [12, 13]], 
                           [[-13, 14],
                            [15, 14]]]]);

        let b1 = a.argmin();
        nj.assertArrayEqual(b1, [[[0, 0],
                                  [0, 0]],
                                 [[0, 0],
                                  [0, 1]]]);
        
        let b2 = a.argmin(2);
        nj.assertArrayEqual(b2, [[[0, 0],
                                  [0, 0]],
                                 [[0, 0],
                                  [0, 0]]]);

        let b3 = a.argmin(1);
        nj.assertArrayEqual(b3, [[[1, 0],
                                  [0, 0]],
                                 [[1, 0],
                                  [0, 0]]]);
        
        let b4 = a.argmin(0);
        nj.assertArrayEqual(b4, [[[0, 0],
                                  [0, 0]],
                                 [[1, 0],
                                  [0, 0]]]);
    }

    test_mean(){
        let a = nj.array([[[ 0, 1, 2], 
                           [-3, 4, 5]]]);
        let b1 = a.mean();
        nj.assertArrayEqual(b1, [[1, 2]]);

        let b2 = a.mean(1);
        nj.assertArrayEqual(b2, [[-1.5, 2.5, 3.5]]);

        let b3 = a.mean(0);
        nj.assertArrayEqual(b3, [[ 0, 1, 2], 
                                 [-3, 4, 5]]);
    }

    test_sum(){
        let a = nj.array([[[ 0, 1, 2], 
                           [-3, 4, 5]]]);
        let b1 = a.sum();
        nj.assertArrayEqual(b1, [[3, 6]]);

        let b2 = a.sum(1);
        nj.assertArrayEqual(b2, [[-3, 5, 7]]);

        let b3 = a.sum(0);
        nj.assertArrayEqual(b3, [[ 0, 1, 2], 
                                 [-3, 4, 5]]);
    }

    test_clip(){
        let a = nj.array([[[-3, -2, -1], 
                           [ 1,  2, 3]]]);
        let b1 = a.clip(-1, 2);
        nj.assertArrayEqual(b1, [[[-1, -1, -1], 
                                  [ 1, 2, 2]]]);
        
        let b2 = a.clip(-1);
        nj.assertArrayEqual(b2, [[[-1, -1, -1], 
                                  [ 1, 2, 3]]]);
        
        let b3 = a.clip(null, 2);
        nj.assertArrayEqual(b3, [[[-3, -2, -1], 
                                  [ 1, 2, 2]]]);
    }

    test_var(){
        // test for var() and std().
        let a = nj.array([[[ 0, 1, 2], 
                           [-3, 4, 5]],
                          [[ 10, 11, 12], 
                           [-13, 14, 15]]]);
        let b1 = a.std(2);
        nj.assertArrayNear(b1, [[0.81649658,  3.55902608],
                                 [0.81649658, 12.97005097]], 1e-6);
        
        let b2 = a.var(1);
        nj.assertArrayNear(b2, [[  2.25, 2.25, 2.25],
                                [132.25, 2.25, 2.25]], 1e-6);

        let b3 = a.var(0);
        nj.assertArrayNear(b3, [[25, 25, 25],
                                [25, 25, 25]], 1e-6);
    }

    test_sort(){
        let a = nj.array([[[0, 1,  2], 
                           [5, 4, -3]],
                          [[-13, 14, 15], 
                           [ 10, 11, -12]],
                          [[ 1, 10, 20],
                           [20, 30, 60]]]);
        let b1 = nj.sort(a, 2);
        nj.assertArrayEqual(b1, [[[  0,  1,  2],
                                  [ -3,  4,  5]],
                                 [[-13, 14, 15],
                                  [-12, 10, 11]],
                                 [[  1, 10, 20],
                                  [ 20, 30, 60]]]);

        let b2 = nj.sort(a, 1);
        nj.assertArrayEqual(b2, [[[  0,  1, -3],
                                  [  5,  4,  2]],
                                 [[-13, 11,-12],
                                  [ 10, 14, 15]],
                                 [[  1, 10, 20],
                                  [ 20, 30, 60]]]);

        let b3 = nj.sort(a, 0);
        nj.assertArrayEqual(b3, [[[-13,  1,   2],
                                  [  5,  4, -12]],
                                 [[  0, 10,  15],
                                  [ 10, 11,  -3]],
                                 [[  1, 14,  20],
                                  [ 20, 30,  60]]]);
    }

    test_squeeze(){
        let a1 = nj.array([[[ 0, 1, 2], 
                            [-3, 4, 5]]]);
        let b1 = nj.squeeze(a1, 0);
        nj.assertArrayEqual(b1, [[ 0, 1, 2], 
                                 [-3, 4, 5]]);

        let a2 = nj.array([[[[ 0], [1], [2]], 
                            [[-3], [4], [5]]]]);
        let b2 = nj.squeeze(a2, [0, 3]);
        nj.assertArrayEqual(b2, [[ 0, 1, 2], 
                                 [-3, 4, 5]]);
    }

    test_expand_dims(){
        let a1 = nj.array([0, 1, 2]);
        let b1 = nj.expand_dims(a1, 0);
        nj.assertArrayEqual(b1, [[0, 1, 2]]);

        let b2 = nj.expand_dims(a1, [0, 1, 3]);
        nj.assertArrayEqual(b2, [[[[0], [1], [2]]]]);
    }
    
    test_linspace(){
        let a = nj.linspace(1, 10, 10);
        nj.assertArrayEqual(a, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }

    
};

let test = new ut_numjs();
test.test();


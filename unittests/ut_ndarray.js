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

    test_add(){
        let a = nj.array([[1, 2], [3, 4]]);
        let b = nj.array([[1, 1], [2, 2]]);        
        let c = nj.add(a, b);
        nj.assertArrayEqual(c, [[2, 3], [5, 6]]);
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
        let c = nj.mul(a, b);
        nj.assertArrayEqual(c, [[1, 2], [6, 8]]);
    }

    test_div(){
        let a = nj.array([[1, 2], [3, 4]]);
        let b = nj.array([[1, 1], [2, 2]]);        
        let c = nj.div(a, b);
        nj.assertArrayEqual(c, [[1, 2], [1.5, 2]]);
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

        let a = nj.zeros([3, 3]);
        let b = nj.zeros([3, 1]);

        for(let i = 0; i < 3; i++){
            const x = i*10;
            a[i][0] = 1.0;
            a[i][1] = x;
            a[i][2] = Math.pow(x,2);
            
            b[i][0] = c0 + (c1*x) + (c2*Math.pow(x,2));
        }

        const x = nj.linalg.solve(a, b);

        nj.assertArrayNear(x, [[c0], [c1], [c2]], 1e-6);
    }
};

let test = new ut_numjs();
test.test();


/**
 * @file camera_geometry.js
 * @brief Camera geometry library in Javascript.
 * @Author Jongmin Park
 */

class CameraGeometry{
    constructor(params){
        this.image_width = params['image_width'];
        this.image_height = params['image_height'];

        this.cu = params['cu'];
        this.cv = params['cv'];

        this.focal_length_u = params['focal_length_u'];
        this.focal_length_v = params['focal_length_v'];

        this.roll = params['roll'];
        this.pitch = params['pitch'];
        this.yaw = params['yaw'];

        this.t_x = params['x'];
        this.t_y = params['y'];
        this.t_z = params['z'];

        this.radial_dist = [0.0, 0.0, 0.0];

        this.computeH();
    }

    computeH(){
        var nj = require('../num.js/num');
        
        // Homography matrix.
        // roll
        const cosr = Math.cos(this.roll);
        const sinr = Math.sin(this.roll);
        const Rx = nj.matrix([[1, 0,    0,     0],
                              [0, cosr, -sinr, 0],
                              [0, sinr, cosr,  0],
                              [0, 0,    0,     1]]);

        // pitch
        const cosp = Math.cos(this.pitch);
        const sinp = Math.sin(this.pitch);
        const Ry = nj.matrix([[cosp,  0, sinp, 0],
                              [0,     1,    0, 0],
                              [-sinp, 0, cosp, 0],
                              [0,     0,    0, 1]]);

        // yaw
        const cosy = Math.cos(this.yaw);
        const siny = Math.sin(this.yaw);
        const Rz = nj.matrix([[cosy, -siny, 0, 0],
                              [siny,  cosy, 0, 0],
                              [0,        0, 1, 0],
                              [0,        0, 0, 1]])

        // translation
        const T = nj.matrix([[1, 0, 0, this.t_x],
                             [0, 1, 0, this.t_y],
                             [0, 0, 1, this.t_z],
                             [0, 0, 0, 1]])

        // intrinsic camera parameter matrix
        const fu = this.focal_length_u;
        const fv = this.focal_length_v;
        const K = nj.matrix([[fu, 0,  this.cu, 0],
                             [0,  fv, this.cv, 0],
                             [0,  0,  1,       0],
                             [0,  0,  0,       1]])

        // permutation matrix
        const P = nj.matrix([[0, -1,  0, 0],
                             [0,  0, -1, 0],
                             [1,  0,  0, 0],
                             [0,  0,  0, 1]]);
        
        const R = nj.matmul(Rz, nj.matmul(Ry, Rx));
        const RT = nj.matmul(R, T);
        const H = nj.matmul(K, nj.matmul(P, RT));

        this.H = H;
        this.invH = nj.linalg.inv(H);

        this.H3x3 = nj.matrix([[H[0][0], H[0][1], H[0][3]],
                               [H[1][0], H[1][1], H[1][3]],
                               [H[2][0], H[2][1], H[2][3]]]);
        this.invH3x3 = nj.linalg.inv(this.H3x3);
    }

};

module.exports = {CameraGeometry};
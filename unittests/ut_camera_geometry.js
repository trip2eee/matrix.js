/**
 * @file ut_camera_geometry.js
 * @brief Camera geometry unit test.
 * @Author Jongmin Park
 */

var nj = require('../num.js/num');
var cg = require('../camera_geometry/camera_geometry');
var ut = require('../htest.js/htest');

class ut_camera_geometry extends ut.htest {
    SetUp(){
        this.camera_params = {
            'x': 1.5,
            'y': 0.1,
            'z': -1.2,
            'roll': -1.0 * nj.pi / 180.0,
            'pitch': 1.0 * nj.pi / 180.0,
            'yaw': 2.0 * nj.pi / 180.0,
            'focal_length_u':600,
            'focal_length_v':600,
            'cu':320,
            'cv':240,
            'image_width': 640,
            'image_height': 480
        };
    }

    TearDown(){

    }

    test_camera_geometry(){
        let cam_geometry = new cg.CameraGeometry(this.camera_params);
        console.log('H\n' + cam_geometry.H);
        nj.assertArrayNear(cam_geometry.H, [[2.98819848e+02, -6.10800337e+02, -5.44484517e+00,  3.93683552e+02],
                                            [2.50288711e+02,  2.02218926e+00, -5.95778039e+02,  1.09056893e+03],
                                            [9.99238615e-01, -3.51985823e-02,  1.68300382e-02,  1.47514202e+00],
                                            [0.00000000e+00,  0.00000000e+00,  0.00000000e+00,  1.00000000e+00]], 1e-5);

        console.log('invH3x3\n' + cam_geometry.invH3x3);
        nj.assertArrayNear(cam_geometry.invH3x3, [[-9.57627238e-05, -2.05361143e-03,  1.54378698e+00],
                                                  [-1.66788703e-03, -1.09763671e-04,  5.26271050e-01],
                                                  [ 2.50705032e-05,  1.38846585e-03, -3.55279397e-01]], 1e-5);
        
        
    }
};


let test = new ut_camera_geometry();
test.test();


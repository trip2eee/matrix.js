  /**
     * @brief This method decomposes matrix into PA = LU
     * @param P  [in] Permutation
     * @param LU [in/out] Decomposed matrix. Lower triangular part: L, Upper triangular part: P.
     * @return This method returns 1U if succeeded. Otherwise, 0U is returned.
    */
  function decomposeLUP(P, LU)
  {
      const ROWS = LU.shape[0];
      const COLS = LU.shape[1];

      let success = true;
      for(let i = 0; i < ROWS; i++){
          P[i] = i;
      }

      // for column k
      for(let k = 0; k < (ROWS - 1); k++){
          let fPivot = 0.0;
          let idxPivot = k;

          // for row i
          for(let i = k; i < ROWS; i++){
              if(Math.abs(LU[i][k]) > fPivot){
                  fPivot = Math.abs(LU[i][k]);
                  idxPivot = i;
              }
          }

          if(Math.abs(fPivot) > 0.0){
            // Pivoting.
            // Permutation.
            const temp = P[k];
            P[k] = P[idxPivot];
            P[idxPivot] = temp;

            // exchange rows.
            for(let j = 0; j < COLS; j++){
                const fTemp = LU[k][j];
                LU[k][j] = LU[idxPivot][j];
                LU[idxPivot][j] = fTemp;
            }

            for(let i = (k + 1); i < ROWS; i++){
                LU[i][k] /= LU[k][k];
                for(let j = (k + 1); j < ROWS; j++){
                    LU[i][j] = LU[i][j] - (LU[i][k] * LU[k][j]);
                }
            }
        }else{
            // singular matrix.
            success = false;
            break;
        }
      }
      return success;
  }

/**
 * @param a (ndarray, in) The matrix to be inverted.
 * @return ainv (ndarray) Inverse of the matrix a.
 */
function inv(a){
    const rows = a.shape[0];
    const cols = a.shape[1]

    var nj = require('./num');
    let b = nj.zeros(a.shape);    
    let P = Array(rows);
    let LU = nj.copy(a);
    let Y = new Array(rows);

    if(decomposeLUP(P, LU)){
        // for each column of identity matrix.
        for(let c = 0; c < cols; c++){
            // Compute forward substitution.
            for(let i = 0; i < rows; i++){
                if(Math.abs(LU[i][i]) > 0.0){
                    // Determine values of the c-th column vector of identity matrix.
                    if(c == P[i]){
                        Y[i] = 1.0;
                    }else{
                        Y[i] = 0.0;
                    }

                    for(let j = 0; j < i; j++){
                        Y[i] -= (LU[i][j] * Y[j]);
                    }
                }else{
                    // If singular matrix.
                    b = null;
                    break;
                }
            }
            if(b == null){
                break;
            }
            
            // Compute backward substitution.            
            for(let i = (rows)-1; i >= 0; i--){
                b[i][c] = Y[i];
                for(let j = (i + 1); j < cols; j++){
                    b[i][c] -= (LU[i][j] * b[j][c]);
                }
                b[i][c] /= LU[i][i];
            }
        }
    }else{
        // If the matrix is singular.
        b = null;
    }
    return b;
}

/**
 * @brief This function solve a linear matrix equation ax = b.
 * @param a (in, ndarray) Coefficient matrix.
 * @param b (in, ndarray) Ordinate or 'dependent variable' values.
 * @return Solution to the equation ax = b.
 */
function solve(a, b){
    var nj = require('./num');
    let x = nj.zeros(b.shape);

    const rows = a.shape[0];
    const cols = a.shape[1]

    var nj = require('./num');
    let P = Array(rows);
    let LU = nj.copy(a);
    let Y = new Array(rows);

    if(decomposeLUP(P, LU)){
        // Compute forward substitution.
        for(let i = 0; i < rows; i++){
            // Test for singularity.
            if(Math.abs(LU[i][i]) > 0.0){
                Y[i] = b[P[i]][0];
                for(let j = 0; j < i; j++){
                    Y[i] -= (LU[i][j] * Y[j]);
                }
            }else{
                x = null;
                break;
            }
        }

        if(x != null){
            // Compute backward substitution.
            for(let i = (rows-1); i >= 0; i--){
                x[i][0] = Y[i];
                for(let j = (i + 1); j < cols; j++){
                    x[i][0] -= LU[i][j] * x[j][0];
                }
                x[i][0] /= LU[i][i];
            }
        }
    }else{
        // If the matrix is singular.
        x = null;
    }

    return x;
}
module.exports = { inv, solve };


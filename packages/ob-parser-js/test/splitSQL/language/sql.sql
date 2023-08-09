CREATE OR REPLACE FUNCTION Interp_func (
  /* Find the value of y at x degrees using Lagrange interpolation: */
     x    IN FLOAT,
     y    IN FLOAT)
  RETURN FLOAT AS
     LANGUAGE C
     NAME "Interp_func"
     LIBRARY MathLib;/
CREATE OR REPLACE PROCEDURE findRoot_proc (
     x IN REAL)
  AS LANGUAGE C
     LIBRARY c_utils
     NAME "C_findRoot"
     PARAMETERS (
        x BY REFERENCE);/
const SQLDocument = require("../lib/index").SQLDocument;

const sql = `
select * from a;
select * from b2;

create or replace PACKAGE BODY ECIF_INF_SALE_PKG IS

  FUNCTION FUN_1000030_PRE(V_BRANCHID IN VARCHAR2 
                          ,
                           V_FLAG     IN VARCHAR2 
                          ,
                           V_EMPNO    IN VARCHAR2 
                          ,
                           V_CUS_TYPE IN VARCHAR2 
                           ) RETURN VARCHAR2 IS
    
    G_QUERY_KEY    TEMP_1000030_PRE.QUERY_KEY%TYPE; 
    P_ROWCOUNTS    NUMBER(10); 
    O_PARTITIONKEY VARCHAR2(15); 
    P_QRYDAT       DATE;
  
    O_PRTMSG  VARCHAR2(250);
    O_PRTCODE VARCHAR2(15);
  
  BEGIN
    
    
    IF P_ROWCOUNTS = 0 THEN
      
      ECIF_PKG_BRANCHID(V_BRANCHID, O_PARTITIONKEY, O_PRTMSG, O_PRTCODE);
    
      IF (V_FLAG = 2) THEN
        
        IF (V_CUS_TYPE = 1) THEN
          
          INSERT INTO R1000030_PRE
            SELECT TRIM(B1.PID) AS ID,
                   MIN(B1.APP_DATE) MIN_APPDATE,
                   MAX(B1.APP_DATE) MAX_APPDATE
              FROM B_L_RISKCON B1
             WHERE B1.BRANCH_CODE = O_PARTITIONKEY
               AND B1.EMP_NO = V_EMPNO
               AND B1.STOP_DATE >= SYSDATE
               AND B1.POLIST IN
                   ('2', 'a', 'd', 'e', 'g', 'A', 'D', 'E', 'G')
             GROUP BY PID;
        ELSIF (V_CUS_TYPE = 2) THEN
          
          INSERT INTO R1000030_PRE_2
            SELECT TRIM(B1.PID) AS ID,
                   MIN(B1.APP_DATE) MIN_APPDATE,
                   MAX(B1.APP_DATE) MAX_APPDATE
              FROM B_L_RISKCON B1
             WHERE B1.BRANCH_CODE = O_PARTITIONKEY
               AND B1.EMP_NO = V_EMPNO
             GROUP BY B1.PID;
        
             SELECT A.ID, A.MIN_APPDATE, A.MAX_APPDATE
             FROM R1000030_PRE_2 A, (SELECT * FROM A2) A1
            WHERE NOT EXISTS
            (SELECT 1
                     FROM B_L_RISKCON B1
                    WHERE B1.BRANCH_CODE = O_PARTITIONKEY
                      AND B1.EMP_NO = V_EMPNO
                      AND A.ID = TRIM(B1.PID)
                      AND B1.STOP_DATE >= SYSDATE
                      AND B1.POLIST IN
                          ('2', 'a', 'd', 'e', 'g', 'A', 'D', 'E', 'G'));
           
        
        ELSE
          
          INSERT INTO R1000030_PRE
            SELECT TRIM(B1.PID) AS ID,
                   MIN(B1.APP_DATE) MIN_APPDATE,
                   MAX(B1.APP_DATE) MAX_APPDATE
              FROM B_L_RISKCON B1
             WHERE B1.BRANCH_CODE = O_PARTITIONKEY
               AND B1.EMP_NO = V_EMPNO
             GROUP BY PID;
        END IF;
        INSERT INTO TEMP_1000030_PRE
          (PARTITIONKEY,
           QUERY_KEY,
           QUERY_DATE,
           SEQNO,
           EMPNO,
           ID,
           NAME,
           SEX,
           BTHDATE,
           MIN_APPDATE,
           MAX_APPDATE,
           MDM_CUST_NO, 
           EDU_LEVEL)
          SELECT O_PARTITIONKEY,
                 G_QUERY_KEY,
                 P_QRYDAT,
                 ROWNUM SEQNO,
                 V_EMPNO
                  ,
                 B.ID,
                 A.PARTY_NAME  AS NAME,
                 A.GENDER      AS SEX,
                 A.BIRTHDATE   AS BTHDATE,
                 B.MIN_APPDATE,
                 B.MAX_APPDATE,
                 A.MDM_CUST_NO,
                 A.EDUC_LEVEL
            FROM B_G_INDIVIDUAL A, R1000030_PRE B
           WHERE (A.PRIM_REG_NO = scv_user.FUN_GETNEWID(B.ID))
          
          ;
        
      
      ELSE
        
      
        INSERT INTO R1000030_PRE
          SELECT TRIM(B1.APID) AS ID,
                 MIN(B1.APP_DATE) MIN_APPDATE,
                 MAX(B1.APP_DATE) MAX_APPDATE
            FROM B_L_RISKCON B1
           WHERE B1.BRANCH_CODE = O_PARTITIONKEY
             AND B1.EMP_NO = V_EMPNO
           GROUP BY APID;
        INSERT INTO TEMP_1000030_PRE
          (PARTITIONKEY,
           QUERY_KEY,
           QUERY_DATE,
           SEQNO,
           EMPNO,
           ID,
           NAME,
           SEX,
           BTHDATE,
           MIN_APPDATE,
           MAX_APPDATE,
           MDM_CUST_NO, 
           EDU_LEVEL)
          SELECT O_PARTITIONKEY,
                 G_QUERY_KEY,
                 P_QRYDAT,
                 ROWNUM SEQNO,
                 V_EMPNO
                  ,
                 B.ID,
                 A.PARTY_NAME  AS NAME,
                 A.GENDER      AS SEX,
                 A.BIRTHDATE   AS BTHDATE,
                 B.MIN_APPDATE,
                 B.MAX_APPDATE,
                 A.MDM_CUST_NO,
                 A.EDUC_LEVEL
            FROM B_G_INDIVIDUAL A, b2.R1000030_PRE B
           WHERE (A.PRIM_REG_NO = scv_user.FUN_GETNEWID(B.ID))
          
          ;
      
      END IF;
      COMMIT;
    END IF;
    RETURN G_QUERY_KEY;
  
    O_PRTCODE := 0;
    O_PRTMSG  := 'success';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      ROLLBACK;
      O_PRTCODE := -2;
      O_PRTMSG  := 'fail:' || SQLERRM;
      ERRLOG.SETPRGNAME('sp_1000030');
      ERRLOG.LOG;
    WHEN OTHERS THEN
      ROLLBACK;
      O_PRTCODE := -1;
      O_PRTMSG  := 'fail:' || SQLERRM;
      ERRLOG.SETPRGNAME('sp_1000030');
      ERRLOG.LOG;
  END FUN_1000030_PRE;
  
END;

`

const doc = new SQLDocument(
    {
        text: sql
    }
);
console.log(doc.statements.map(a => {
    const { tables, tableVariables } = a.getAllFromTable();
    const tablesText = tables?.map(item => `alias: ${item.alias}, name: ${item.name}, schema: ${item.schema}`)?.join('\n');
    const tableVariablesText = tableVariables?.map(item => `variables> column: ${item.column}, name: ${item.name}, schema: ${item.schema}`)?.join('\n');
    return [tablesText, tableVariablesText]
}))

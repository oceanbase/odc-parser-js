const SQLDocument = require("../lib/index").SQLDocument;

const sql = `
SELECT /*+parallel(32)*/
  NVL(S.FULL_NAME, TEMP.SHORT_NAME) AS SHORT_NAME,
  TEMP.*,
  TO_CHAR(TEMP.BALANCE_START_DATE, 'MM/DD') || '-' || TO_CHAR(TEMP.BALANCE_END_DATE, 'MM/DD') AS SALE_MONTH,
  Z.NAME AS ZONE_NAME, G.NAME AS ORGAN_NAME, BG.ORGAN_NO BIZ_NO, BG.NAME BIZ_NAME, M.BSGROUPS_NO, B.NAME AS BSGROUPS_NAME, R.REGION_NO,
  R.NAME AS REGION_NAME, G.NAME AS PROVINCE_NAME, LE7.NAME AS CHANNELNAME, BU.NAME AS BRAND_UNIT_NAME,
  CASE WHEN T0.BRAND_FLAG = 1 THEN '��' ELSE '��' END AS BRAND_FLAG, ROWID AS "__ODC_INTERNAL_ROWID__" 
FROM
  (
    SELECT TB.*
    FROM(
        SELECT A3.*,
          TO_CHAR(A3.INVOICE_APPLY_DATE, 'YYYYMM') AS BILLMONTH,
          SNR.REPLACE_NO AS REPLACESHOPNO,
          SNR.REPLACE_NAME AS REPLACESHOPNAME,
          ROWNUM RN
        FROM
          (
            SELECT
              MAX(A2.ZONE_NO) ZONE_NO,
              MAX(A2.PROVINCE_NO) PROVINCE_NO,
              A2.COMPANY_NO,
              MAX(A2.COMPANY_NAME) COMPANY_NAME,
              A2.ORGAN_NO,
              MAX(A2.IS_TSC_TXD) AS IS_TSC_TXD,
              MAX(A2.BIZ_CITY_NO) BIZ_CITY_NO,
              A2.SHOP_NO,
              MAX(A2.SHORT_NAME) SHORT_NAME,
              MAX(A2.BIZ_TYPE) BIZ_TYPE,
              A2.BALCANCE_DATE_ID,
              MAX(A2.MONTH) MONTH,
              MAX(A2.BALANCE_START_DATE) BALANCE_START_DATE,
              MAX(A2.BALANCE_END_DATE) BALANCE_END_DATE,
              A2.BRAND_UNIT_NO,
              A2.CHANNEL_FLAG,
              MAX(A2.CHANNEL_FLAG_NAME) AS CHANNEL_FLAG_NAME,
              MAX(CATEGORY.CATEGORY_NOS) CATEGORY_NO,
              MAX(CATEGORY.FINANCIAL_CATEGORY_NAME) AS CATEGORY_NAME,
              CASE
              WHEN SUM(
                CASE
                WHEN A2.BI_PERIOD_SALESNUM_ABS > 0
                AND A2.INVOICE_APPLY_DATE IS NULL THEN 1
                ELSE 0
                END
              ) > 0
              OR SUM(
                CASE
                WHEN A2.BI_PERIOD_SALESNUM_ABS > 0
                AND A2.INVOICE_APPLY_DATE IS NOT NULL THEN 1
                ELSE 0
                END
              ) = 0 THEN NULL
              ELSE MAX(A2.SALER_NAME)
            END
              AS SALER_NAME,
              CASE
              WHEN SUM(
                CASE
                WHEN A2.BI_PERIOD_SALESNUM_ABS > 0
                AND A2.INVOICE_APPLY_DATE IS NULL THEN 1
                ELSE 0
                END
              ) > 0
              OR SUM(
                CASE
                WHEN A2.BI_PERIOD_SALESNUM_ABS > 0
                AND A2.INVOICE_APPLY_DATE IS NOT NULL THEN 1
                ELSE 0
                END
              ) = 0 THEN NULL
              ELSE MAX(A2.INVOICE_APPLY_DATE)
            END
              AS INVOICE_APPLY_DATE,
              MAX(A2.MALL_NO) MALL_NO,
              MAX(A2.FULL_NAME) FULL_NAME,
              MAX(A2.STARTUP_TIME) STARTUP_TIME,
              MAX(A2.SHOP_LEVEL) SHOP_LEVEL,
              MAX(A2.CATEGORY_CODE) CATEGORY_CODE,
              MAX(A2.SHOP_CLASSIFY) SHOP_CLASSIFY,
              MAX(A2.OPEN_DATE) OPEN_DATE,
              MAX(A2.EMPLOYE_AMOUNT) EMPLOYE_AMOUNT,
              MAX(A2.AREA) AREA,
              MAX(A2.AREA_LEFT) AREA_LEFT,
              MAX(A2.AREA_TOTAL) AREA_TOTAL,
              MAX(A2.REGION_NO) REGION_NO,
              MAX(A2.SALE_MODE) SALE_MODE,
              MAX(A2.RETAIL_TYPE) RETAIL_TYPE,
              MAX(A2.MULTI) MULTI,
              MAX(A2.STATUS) STATUS,
              MAX(A2.CHANNEL_NO) CHANNEL_NO,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.LMA_PERIOD_SALESNUM
                  ELSE NULL
                  END
                ),
                0
              ) AS LMA_PERIOD_SALESNUM,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.LMA_PERIOD_REALAMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS LMA_PERIOD_REALAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.LMA_PERIOD_SALESAMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS LMA_PERIOD_SALESAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.LMA_PERIOD_TAGAMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS LMA_PERIOD_TAGAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.LMA_PERIOD_SALESCOST
                  ELSE NULL
                  END
                ),
                0
              ) AS LMA_PERIOD_SALESCOST,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.LMA_PERIOD_SALESBRANDCOST
                  ELSE NULL
                  END
                ),
                0
              ) AS LMA_PERIOD_SALESBRANDCOST,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.LMA_PERIOD_SALESDEDUCTIONS
                  ELSE NULL
                  END
                ),
                0
              ) AS LMA_PERIOD_SALESDEDUCTIONS,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.LMA_PERIOD_SALESDEDUCTIONS
                  ELSE NULL
                  END
                ),
                0
              ) AS LMA_PERIOD_OTHERDEDUCTIONS,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.LMA_PERIOD_BALANCEAMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS LMA_PERIOD_BALANCEAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.LMA_CUSTOMER_SETTLE_AMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS LMA_CUSTOMER_SETTLE_AMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.LMA_PLATFORM_BEAR_AMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS LMA_PLATFORM_BEAR_AMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.BI_PERIOD_SALESNUM
                  ELSE NULL
                  END
                ),
                0
              ) AS BI_PERIOD_SALESNUM,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.BI_PERIOD_REALAMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS BI_PERIOD_REALAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.BI_PERIOD_SALESAMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS BI_PERIOD_SALESAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.BI_PERIOD_TAGAMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS BI_PERIOD_TAGAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.BI_PERIOD_SALESCOST
                  ELSE NULL
                  END
                ),
                0
              ) AS BI_PERIOD_SALESCOST,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.BI_PERIOD_SALESBRANDCOST
                  ELSE NULL
                  END
                ),
                0
              ) AS BI_PERIOD_SALESBRANDCOST,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.BI_PERIOD_SALESDEDUCTIONS
                  ELSE NULL
                  END
                ),
                0
              ) AS BI_PERIOD_SALESDEDUCTIONS,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.BI_PERIOD_SALESDEDUCTIONS
                  ELSE NULL
                  END
                ),
                0
              ) AS BI_PERIOD_OTHERDEDUCTIONS,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.BI_PERIOD_BALANCEAMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS BI_PERIOD_BALANCEAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.BI_PERIOD_BALANCEAMOUNT / 1.17
                  ELSE NULL
                  END
                ),
                0
              ) AS BI_PE_NO_TAX_BALANCEAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.BI_CUSTOMER_SETTLE_AMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS BI_CUSTOMER_SETTLE_AMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.BI_PLATFORM_BEAR_AMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS BI_PLATFORM_BEAR_AMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.REAL_BUY_AMOUNT1, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS REAL_BUY_AMOUNT1,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.SURPLUS_AMOUNT, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS SURPLUS_AMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.VOUCHER_DIFFERENCE, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS VOUCHER_DIFFERENCE,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.BI_PERIOD_SALESNUM
                  ELSE NULL
                  END
                ),
                0
              ) AS QTY,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.BI_PERIOD_BALANCEAMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS SEND_AMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.TMA_PERIOD_SALESNUM
                  ELSE NULL
                  END
                ),
                0
              ) AS TMA_PERIOD_SALESNUM,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.TMA_PERIOD_REALAMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS TMA_PERIOD_REALAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.TMA_PERIOD_SALESAMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS TMA_PERIOD_SALESAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.TMA_PERIOD_TAGAMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS TMA_PERIOD_TAGAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.TMA_PERIOD_SALESCOST
                  ELSE NULL
                  END
                ),
                0
              ) AS TMA_PERIOD_SALESCOST,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.TMA_PERIOD_SALESBRANDCOST
                  ELSE NULL
                  END
                ),
                0
              ) AS TMA_PERIOD_SALESBRANDCOST,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.TMA_PERIOD_SALESDEDUCTIONS
                  ELSE NULL
                  END
                ),
                0
              ) AS TMA_PERIOD_SALESDEDUCTIONS,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.TMA_PERIOD_SALESDEDUCTIONS
                  ELSE NULL
                  END
                ),
                0
              ) AS TMA_PERIOD_OTHERDEDUCTIONS,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.TMA_PERIOD_BALANCEAMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS TMA_PERIOD_BALANCEAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.TMA_PERIOD_BALANCEAMOUNT / 1.17
                  ELSE NULL
                  END
                ),
                0
              ) AS TMA_PE_NO_TAX_BALANCEAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.TMA_CUSTOMER_SETTLE_AMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS TMA_CUSTOMER_SETTLE_AMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN A2.TMA_PLATFORM_BEAR_AMOUNT
                  ELSE NULL
                  END
                ),
                0
              ) AS TMA_PLATFORM_BEAR_AMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_SALESNUM, 0) - NVL(A2.LMA_PERIOD_SALESNUM, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TMI_PERIOD_SALESNUM,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_REALAMOUNT, 0) - NVL(A2.LMA_PERIOD_REALAMOUNT, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TMI_PERIOD_REALAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_SALESAMOUNT, 0) - NVL(A2.LMA_PERIOD_SALESAMOUNT, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TMI_PERIOD_SALESAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_TAGAMOUNT, 0) - NVL(A2.LMA_PERIOD_TAGAMOUNT, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TMI_PERIOD_TAGAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_SALESCOST, 0) - NVL(A2.LMA_PERIOD_SALESCOST, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TMI_PERIOD_SALESCOST,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_SALESBRANDCOST, 0) - NVL(A2.LMA_PERIOD_SALESBRANDCOST, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TMI_PERIOD_SALESBRANDCOST,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_SALESDEDUCTIONS, 0) - NVL(A2.LMA_PERIOD_SALESDEDUCTIONS, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TMI_PERIOD_SALESDEDUCTIONS,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_SALESDEDUCTIONS, 0) - NVL(A2.LMA_PERIOD_SALESDEDUCTIONS, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TMI_PERIOD_OTHERDEDUCTIONS,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_BALANCEAMOUNT, 0) - NVL(A2.LMA_PERIOD_BALANCEAMOUNT, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TMI_PERIOD_BALANCEAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_CUSTOMER_SETTLE_AMOUNT, 0) - NVL(A2.LMA_CUSTOMER_SETTLE_AMOUNT, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TMI_CUSTOMER_SETTLE_AMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PLATFORM_BEAR_AMOUNT, 0) - NVL(A2.LMA_PLATFORM_BEAR_AMOUNT, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TMI_PLATFORM_BEAR_AMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_SALESNUM, 0) - NVL(A2.LMA_PERIOD_SALESNUM, 0) + NVL(A2.TMA_PERIOD_SALESNUM, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TM_SALESNUM,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_REALAMOUNT, 0) - NVL(A2.LMA_PERIOD_REALAMOUNT, 0) + NVL(A2.TMA_PERIOD_REALAMOUNT, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TM_REALAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_SALESAMOUNT, 0) - NVL(A2.LMA_PERIOD_SALESAMOUNT, 0) + NVL(A2.TMA_PERIOD_SALESAMOUNT, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TM_SALESAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_TAGAMOUNT, 0) - NVL(A2.LMA_PERIOD_TAGAMOUNT, 0) + NVL(A2.TMA_PERIOD_TAGAMOUNT, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TM_TAGAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_SALESCOST, 0) - NVL(A2.LMA_PERIOD_SALESCOST, 0) + NVL(A2.TMA_PERIOD_SALESCOST, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TM_SALESCOST,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_SALESBRANDCOST, 0) - NVL(A2.LMA_PERIOD_SALESBRANDCOST, 0) + NVL(A2.TMA_PERIOD_SALESBRANDCOST, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TM_SALESBRANDCOST,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_SALESDEDUCTIONS, 0) - NVL(A2.LMA_PERIOD_SALESDEDUCTIONS, 0) + NVL(A2.TMA_PERIOD_SALESDEDUCTIONS, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TM_SALESDEDUCTIONS,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_SALESDEDUCTIONS, 0) - NVL(A2.LMA_PERIOD_SALESDEDUCTIONS, 0) + NVL(A2.TMA_PERIOD_SALESDEDUCTIONS, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TM_OTHERDEDUCTIONS,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_BALANCEAMOUNT, 0) - NVL(A2.LMA_PERIOD_BALANCEAMOUNT, 0) + NVL(A2.TMA_PERIOD_BALANCEAMOUNT, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TM_BALANCEAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN (
                    NVL(A2.BI_PERIOD_BALANCEAMOUNT, 0) - NVL(A2.LMA_PERIOD_BALANCEAMOUNT, 0) + NVL(A2.TMA_PERIOD_BALANCEAMOUNT, 0)
                  ) / 1.17
                  ELSE NULL
                  END
                ),
                0
              ) AS NON_TAX_SALESAMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.BI_PERIOD_SALESCOST, 0) - NVL(A2.LMA_PERIOD_SALESCOST, 0) + NVL(A2.TMA_PERIOD_SALESCOST, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TAX_COST,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN (
                    NVL(A2.BI_PERIOD_SALESCOST, 0) - NVL(A2.LMA_PERIOD_SALESCOST, 0) + NVL(A2.TMA_PERIOD_SALESCOST, 0)
                  ) / 1.17
                  ELSE NULL
                  END
                ),
                0
              ) AS NO_TAX_COSTS,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.REGION_COST, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS REGION_COST,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.HEADQUARTER_COST, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS HEADQUARTER_COST,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.PURCHASE_PRICE, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS PURCHASE_PRICE,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.FACTORY_PRICE, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS FACTORY_PRICE,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.REAL_BUY_AMOUNT, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS REAL_BUY_AMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.CUSTOMER_SETTLE_AMOUNT, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TM_CUSTOMER_SETTLE_AMOUNT,
              NVL(
                SUM(
                  CASE
                  WHEN INSTR(CATEGORY.CATEGORY_NOS, A2.CATEGORY_NO) <> 0 THEN NVL(A2.PLATFORM_BEAR_AMOUNT, 0)
                  ELSE NULL
                  END
                ),
                0
              ) AS TM_PLATFORM_BEAR_AMOUNT,
              MAX(A2.TEMP_ORDER_SOURCE) AS TEMP_ORDER_SOURCE
            FROM
              (
                SELECT
                  MAX(A1.ZONE_NO) ZONE_NO,
                  MAX(A1.PROVINCE_NO) PROVINCE_NO,
                  A1.COMPANY_NO,
                  MAX(A1.COMPANY_NAME) COMPANY_NAME,
                  A1.ORGAN_NO,
                  MAX(A1.IS_TSC_TXD) IS_TSC_TXD,
                  MAX(A1.BIZ_CITY_NO) BIZ_CITY_NO,
                  A1.SHOP_NO,
                  MAX(A1.SHORT_NAME) SHORT_NAME,
                  '4' AS BIZ_TYPE,
                  A1.BALCANCE_DATE_ID,
                  MAX(A1.MONTH) MONTH,
                  MAX(A1.BALANCE_START_DATE) BALANCE_START_DATE,
                  MAX(A1.BALANCE_END_DATE) BALANCE_END_DATE,
                  A1.BRAND_UNIT_NO,
                  A1.CATEGORY_NO,
                  A1.CHANNEL_FLAG,
                  MAX(A1.CHANNEL_FLAG_NAME) AS CHANNEL_FLAG_NAME,
                  CASE
                  WHEN SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN A1.BALANCE_START_DATE
                    AND A1.BALANCE_END_DATE
                    AND A1.INVOICE_APPLY_DATE IS NULL THEN 1
                    ELSE 0
                    END
                  ) > 0 THEN NULL
                  ELSE MAX(A1.COMPANY_NAME)
                END
                  AS SALER_NAME,
                  CASE
                  WHEN SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN A1.BALANCE_START_DATE
                    AND A1.BALANCE_END_DATE
                    AND A1.INVOICE_APPLY_DATE IS NULL THEN 1
                    ELSE 0
                    END
                  ) > 0 THEN NULL
                  ELSE MAX(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN A1.BALANCE_START_DATE
                    AND A1.BALANCE_END_DATE THEN A1.INVOICE_APPLY_DATE
                    ELSE NULL
                    END
                  )
                END
                  AS INVOICE_APPLY_DATE,
                  MAX(A1.MALL_NO) MALL_NO,
                  MAX(A1.FULL_NAME) FULL_NAME,
                  MAX(A1.STARTUP_TIME) STARTUP_TIME,
                  MAX(A1.SHOP_LEVEL) SHOP_LEVEL,
                  MAX(A1.CATEGORY_CODE) CATEGORY_CODE,
                  MAX(A1.SHOP_CLASSIFY) SHOP_CLASSIFY,
                  MAX(A1.OPEN_DATE) OPEN_DATE,
                  MAX(A1.EMPLOYE_AMOUNT) EMPLOYE_AMOUNT,
                  MAX(A1.AREA) AREA,
                  MAX(A1.AREA_LEFT) AREA_LEFT,
                  MAX(A1.AREA_TOTAL) AREA_TOTAL,
                  MAX(A1.REGION_NO) REGION_NO,
                  MAX(A1.SALE_MODE) SALE_MODE,
                  MAX(A1.RETAIL_TYPE) RETAIL_TYPE,
                  MAX(A1.MULTI) MULTI,
                  MAX(A1.STATUS) STATUS,
                  MAX(A1.CHANNEL_NO) CHANNEL_NO,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE < TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    ) THEN A1.QTY
                    ELSE NULL
                    END
                  ) AS LMA_PERIOD_SALESNUM,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE < TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    ) THEN A1.REAL_AMOUNT
                    ELSE NULL
                    END
                  ) AS LMA_PERIOD_REALAMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE < TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    ) THEN A1.AMOUNT
                    ELSE NULL
                    END
                  ) AS LMA_PERIOD_SALESAMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE < TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    ) THEN A1.SUM_TAG_PRICE
                    ELSE NULL
                    END
                  ) AS LMA_PERIOD_TAGAMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE < TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    ) THEN A1.SUM_UNIT_COST
                    ELSE NULL
                    END
                  ) AS LMA_PERIOD_SALESCOST,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE < TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    ) THEN A1.SUM_BRAND_UNIT_COST
                    ELSE NULL
                    END
                  ) AS LMA_PERIOD_SALESBRANDCOST,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE < TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    ) THEN A1.DEDUCTIONS
                    ELSE NULL
                    END
                  ) AS LMA_PERIOD_SALESDEDUCTIONS,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE < TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    ) THEN A1.AMOUNT - A1.DEDUCTIONS
                    ELSE NULL
                    END
                  ) AS LMA_PERIOD_BALANCEAMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE < TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    ) THEN A1.CUSTOMER_SETTLE_AMOUNT
                    ELSE NULL
                    END
                  ) AS LMA_CUSTOMER_SETTLE_AMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE < TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    ) THEN A1.PLATFORM_BEAR_AMOUNT
                    ELSE NULL
                    END
                  ) AS LMA_PLATFORM_BEAR_AMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN A1.BALANCE_START_DATE
                    AND A1.BALANCE_END_DATE THEN A1.QTY
                    ELSE NULL
                    END
                  ) AS BI_PERIOD_SALESNUM,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN A1.BALANCE_START_DATE
                    AND A1.BALANCE_END_DATE THEN A1.REAL_AMOUNT
                    ELSE NULL
                    END
                  ) AS BI_PERIOD_REALAMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN A1.BALANCE_START_DATE
                    AND A1.BALANCE_END_DATE THEN A1.AMOUNT
                    ELSE NULL
                    END
                  ) AS BI_PERIOD_SALESAMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN A1.BALANCE_START_DATE
                    AND A1.BALANCE_END_DATE THEN A1.SUM_TAG_PRICE
                    ELSE NULL
                    END
                  ) AS BI_PERIOD_TAGAMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN A1.BALANCE_START_DATE
                    AND A1.BALANCE_END_DATE THEN A1.SUM_UNIT_COST
                    ELSE NULL
                    END
                  ) AS BI_PERIOD_SALESCOST,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN A1.BALANCE_START_DATE
                    AND A1.BALANCE_END_DATE THEN A1.SUM_BRAND_UNIT_COST
                    ELSE NULL
                    END
                  ) AS BI_PERIOD_SALESBRANDCOST,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN A1.BALANCE_START_DATE
                    AND A1.BALANCE_END_DATE THEN A1.DEDUCTIONS
                    ELSE NULL
                    END
                  ) AS BI_PERIOD_SALESDEDUCTIONS,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN A1.BALANCE_START_DATE
                    AND A1.BALANCE_END_DATE THEN A1.AMOUNT - A1.DEDUCTIONS
                    ELSE NULL
                    END
                  ) AS BI_PERIOD_BALANCEAMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN A1.BALANCE_START_DATE
                    AND A1.BALANCE_END_DATE THEN ABS(A1.QTY)
                    ELSE NULL
                    END
                  ) AS BI_PERIOD_SALESNUM_ABS,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN A1.BALANCE_START_DATE
                    AND A1.BALANCE_END_DATE THEN A1.CUSTOMER_SETTLE_AMOUNT
                    ELSE NULL
                    END
                  ) AS BI_CUSTOMER_SETTLE_AMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN A1.BALANCE_START_DATE
                    AND A1.BALANCE_END_DATE THEN A1.PLATFORM_BEAR_AMOUNT
                    ELSE NULL
                    END
                  ) AS BI_PLATFORM_BEAR_AMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    )
                    AND ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.REAL_BUY_AMOUNT1
                    ELSE NULL
                    END
                  ) AS REAL_BUY_AMOUNT1,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    )
                    AND ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.SURPLUS_AMOUNT
                    ELSE NULL
                    END
                  ) AS SURPLUS_AMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    )
                    AND ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.VOUCHER_DIFFERENCE
                    ELSE NULL
                    END
                  ) AS VOUCHER_DIFFERENCE,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE > A1.BALANCE_END_DATE
                    AND A1.SALE_DATE <= ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.QTY
                    ELSE NULL
                    END
                  ) AS TMA_PERIOD_SALESNUM,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE > A1.BALANCE_END_DATE
                    AND A1.SALE_DATE <= ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.REAL_AMOUNT
                    ELSE NULL
                    END
                  ) AS TMA_PERIOD_REALAMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE > A1.BALANCE_END_DATE
                    AND A1.SALE_DATE <= ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.AMOUNT
                    ELSE NULL
                    END
                  ) AS TMA_PERIOD_SALESAMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE > A1.BALANCE_END_DATE
                    AND A1.SALE_DATE <= ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.SUM_TAG_PRICE
                    ELSE NULL
                    END
                  ) AS TMA_PERIOD_TAGAMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE > A1.BALANCE_END_DATE
                    AND A1.SALE_DATE <= ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.SUM_UNIT_COST
                    ELSE NULL
                    END
                  ) AS TMA_PERIOD_SALESCOST,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE > A1.BALANCE_END_DATE
                    AND A1.SALE_DATE <= ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.SUM_BRAND_UNIT_COST
                    ELSE NULL
                    END
                  ) AS TMA_PERIOD_SALESBRANDCOST,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE > A1.BALANCE_END_DATE
                    AND A1.SALE_DATE <= ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.DEDUCTIONS
                    ELSE NULL
                    END
                  ) AS TMA_PERIOD_SALESDEDUCTIONS,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE > A1.BALANCE_END_DATE
                    AND A1.SALE_DATE <= ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.AMOUNT - A1.DEDUCTIONS
                    ELSE NULL
                    END
                  ) AS TMA_PERIOD_BALANCEAMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE > A1.BALANCE_END_DATE
                    AND A1.SALE_DATE <= ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.CUSTOMER_SETTLE_AMOUNT
                    ELSE NULL
                    END
                  ) AS TMA_CUSTOMER_SETTLE_AMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE > A1.BALANCE_END_DATE
                    AND A1.SALE_DATE <= ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.PLATFORM_BEAR_AMOUNT
                    ELSE NULL
                    END
                  ) AS TMA_PLATFORM_BEAR_AMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    )
                    AND ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.SUM_REGION_COST
                    ELSE NULL
                    END
                  ) AS REGION_COST,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    )
                    AND ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.SUM_HEADQUARTER_COST
                    ELSE NULL
                    END
                  ) AS HEADQUARTER_COST,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    )
                    AND ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.SUM_PURCHASE_PRICE
                    ELSE NULL
                    END
                  ) AS PURCHASE_PRICE,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    )
                    AND ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.FACTORY_PRICE
                    ELSE NULL
                    END
                  ) AS FACTORY_PRICE,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    )
                    AND ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.REAL_BUY_AMOUNT
                    ELSE NULL
                    END
                  ) AS REAL_BUY_AMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    )
                    AND ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.CUSTOMER_SETTLE_AMOUNT
                    ELSE NULL
                    END
                  ) AS CUSTOMER_SETTLE_AMOUNT,
                  SUM(
                    CASE
                    WHEN A1.SALE_DATE BETWEEN TO_DATE(
                      SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                      'YYYY-MM-DD'
                    )
                    AND ADD_MONTHS(
                      TO_DATE(
                        SUBSTR(A1.MONTH, 1, 4) || '-' || SUBSTR(A1.MONTH, 5, 2) || '-01',
                        'YYYY-MM-DD'
                      ),
                      1
                    ) -1 THEN A1.PLATFORM_BEAR_AMOUNT
                    ELSE NULL
                    END
                  ) AS PLATFORM_BEAR_AMOUNT,
                  MAX(A1.TEMP_ORDER_SOURCE) AS TEMP_ORDER_SOURCE
                FROM
                  (
                    SELECT
                      A.ZONE_NO,
                      A.COMPANY_NO,
                      A.COMPANY_NAME,
                      A.PROVINCE_NO,
                      A.ORGAN_NO,
                      A.BIZ_CITY_NO,
                      A.MAJOR,
                      A.STARTUP_TIME,
                      A.SHOP_LEVEL,
                      A.CATEGORY_CODE,
                      A.MALL_NO,
                      A.FULL_NAME,
                      A.SHOP_CLASSIFY,
                      A.OPEN_DATE,
                      A.EMPLOYE_AMOUNT,
                      A.AREA,
                      A.AREA_LEFT,
                      A.AREA_TOTAL,
                      A.REGION_NO,
                      A.SALE_MODE,
                      A.RETAIL_TYPE,
                      A.MULTI,
                      A.CHANNEL_NO,
                      A.STATUS,
                      A.BALCANCE_DATE_ID,
                      A.MONTH,
                      A.BALANCE_START_DATE,
                      A.BALANCE_END_DATE,
                      A.REAL_BUY_AMOUNT1,
                      A.SURPLUS_AMOUNT,
                      A.VOUCHER_DIFFERENCE,
                      A.ID,
                      A.REL_NO,
                      A.SALE_DATE,
                      A.ITEM_NO,
                      A.BRAND_NO,
                      A.BRAND_NAME,
                      A.BRAND_UNIT_NO,
                      A.CATEGORY_NO,
                      A.QTY,
                      A.REAL_AMOUNT,
                      A.AMOUNT,
                      A.TAG_PRICE,
                      A.DISCOUNT,
                      A.SUM_TAG_PRICE,
                      A.SUM_UNIT_COST,
                      A.SUM_REGION_COST,
                      A.SUM_HEADQUARTER_COST,
                      A.SUM_PURCHASE_PRICE,
                      A.FACTORY_PRICE,
                      A.REAL_BUY_AMOUNT,
                      A.CUSTOMER_SETTLE_AMOUNT,
                      A.DEDUCTIONS,
                      A.TEMP_ORDER_SOURCE,
                      A.IS_TSC_TXD,
                      A.PLATFORM_BEAR_AMOUNT,
                      NVL(A.REAL_SHOP_NO, A.SHOP_NO) AS SHOP_NO,
                      NVL(A.REAL_SHORT_NAME, A.SHORT_NAME) AS SHORT_NAME,
                      IACD.INVOICE_APPLY_NO,
                      IACD.INVOICE_APPLY_DATE,
                      A.CHANNEL_FLAG,
                      A.CHANNEL_FLAG_NAME,
                      A.SUM_BRAND_UNIT_COST
                    FROM
                      (
                        SELECT
                          O.ZONE_NO,
                          C.COMPANY_NO,
                          C.NAME AS COMPANY_NAME,
                          S.PROVINCE_NO,
                          O.PARENT_NO AS ORGAN_NO,
                          S.BIZ_CITY_NO,
                          (
                            CASE
                            WHEN INSTR('LNDQXZ,LNZQXZ,LNXQXZ,LNBQXZ', DTL.SHOP_NO) > 0 THEN DTL.SHOP_NO
                            WHEN S.SALE_MODE = '05' THEN (
                              CASE
                              WHEN DTL.BRAND_UNIT_NO = 'MT'
                              OR SUBSTR(S.SHOP_NO, 1, 2) = 'MT' THEN CONCAT('MT', SUBSTR(O.PARENT_NO, -4)) || MAIN.COMPANY_NO || 'TG'
                              WHEN DTL.BRAND_UNIT_NO = 'NK'
                              AND INSTR('E9002,C9008', MAIN.COMPANY_NO) > 0
                              AND O.PARENT_NO = 'M0316' THEN DTL.BRAND_UNIT_NO || SUBSTR(O.PARENT_NO, -4) || MAIN.COMPANY_NO || 'TG'
                              ELSE CONCAT(DTL.BRAND_UNIT_NO, SUBSTR(O.PARENT_NO, -4)) || MAIN.COMPANY_NO || 'TG'
                              END
                            )
                            ELSE (
                              CASE
                              WHEN DTL.BRAND_UNIT_NO = 'MT'
                              OR SUBSTR(S.SHOP_NO, 1, 2) = 'MT' THEN CONCAT('MT', SUBSTR(O.PARENT_NO, -4)) || MAIN.COMPANY_NO
                              WHEN DTL.BRAND_UNIT_NO = 'NK'
                              AND INSTR('E9002,C9008', MAIN.COMPANY_NO) > 0
                              AND O.PARENT_NO = 'M0316' THEN DTL.BRAND_UNIT_NO || SUBSTR(O.PARENT_NO, -4) || MAIN.COMPANY_NO
                              ELSE CONCAT(DTL.BRAND_UNIT_NO, SUBSTR(O.PARENT_NO, -4)) || MAIN.COMPANY_NO
                              END
                            )
                            END
                          ) AS SHOP_NO,
                          (
                            CASE
                            WHEN INSTR('LNDQXZ,LNZQXZ,LNXQXZ,LNBQXZ', DTL.SHOP_NO) > 0 THEN DTL.SHOP_NAME
                            WHEN S.SALE_MODE = '05' THEN (
                              CASE
                              WHEN DTL.BRAND_UNIT_NO = 'MT'
                              OR SUBSTR(S.SHOP_NO, 1, 2) = 'MT' THEN O2.NAME || '�Ź���' || 'MT'
                              ELSE O2.NAME || '�Ź���' || DTL.BRAND_UNIT_NO
                              END
                            )
                            ELSE (
                              CASE
                              WHEN DTL.BRAND_UNIT_NO = 'MT'
                              OR SUBSTR(S.SHOP_NO, 1, 2) = 'MT' THEN O2.NAME || '��˾��' || 'MT'
                              ELSE O2.NAME || '��˾��' || DTL.BRAND_UNIT_NO
                              END
                            )
                            END
                          ) AS SHORT_NAME,
                          S.MAJOR,
                          S.STARTUP_TIME,
                          S.SHOP_LEVEL,
                          S.CATEGORY_CODE,
                          S.MALL_NO,
                          S.FULL_NAME,
                          S.SHOP_CLASSIFY,
                          S.OPEN_DATE,
                          S.EMPLOYE_AMOUNT,
                          S.AREA,
                          S.AREA_LEFT,
                          S.AREA_TOTAL,
                          S.REGION_NO,
                          CASE
                          WHEN S.SALE_MODE = '05' THEN '05'
                          ELSE '07'
                        END
                          AS SALE_MODE,
                          CASE
                          WHEN SUBSTR(DTL.BRAND_NO, 1, 2) = 'MT'
                          OR SUBSTR(S.SHOP_NO, 1, 2) = 'MT' THEN '0502'
                          ELSE '0501'
                        END
                          AS RETAIL_TYPE,
                          CASE
                          WHEN S.SALE_MODE = '05' THEN '050107'
                          ELSE '070301'
                        END
                          AS MULTI,
                          S.CHANNEL_NO,
                          S.STATUS,
                          IPB.ID AS BALCANCE_DATE_ID,
                          IPB.BALANCE_MONTH AS MONTH,
                          IPB.BALANCE_START_DATE,
                          IPB.BALANCE_END_DATE,
                          DTL.REAL_BUY_AMOUNT AS REAL_BUY_AMOUNT1,
                          DTL.SURPLUS_AMOUNT AS SURPLUS_AMOUNT,
                          (
                            NVL(DTL.SURPLUS_AMOUNT, 0) - NVL(DTL.REAL_BUY_AMOUNT, 0)
                          ) AS VOUCHER_DIFFERENCE,
                          DTL.ID,
                          MAIN.ORDER_NO AS REL_NO,
                          MAIN.OUT_DATE AS SALE_DATE,
                          DTL.ITEM_NO,
                          DTL.BRAND_NO,
                          DTL.BRAND_NAME,
                          SUBSTR(DTL.BRAND_NO, 1, 2) AS BRAND_UNIT_NO,
                          SUBSTR(DTL.CATEGORY_NO, 1, 2) AS CATEGORY_NO,
                          DTL.QTY,
                          DTL.AMOUNT AS REAL_AMOUNT,
                          DECODE(
                            DTL.BALANCE_BASE,
                            1,
                            DTL.TAG_PRICE * DTL.QTY,
                            DTL.AMOUNT
                          ) AS AMOUNT,
                          DTL.TAG_PRICE,
                          NVL(DTL.DISCOUNT, 0) AS DISCOUNT,
                          DTL.TAG_PRICE * DTL.QTY AS SUM_TAG_PRICE,
                          DTL.UNIT_COST * DTL.QTY AS SUM_UNIT_COST,
                          DTL.REGION_COST * DTL.QTY AS SUM_REGION_COST,
                          DTL.HEADQUARTER_COST * DTL.QTY AS SUM_HEADQUARTER_COST,
                          DTL.PURCHASE_PRICE * DTL.QTY AS SUM_PURCHASE_PRICE,
                          DTL.FACTORY_PRICE * DTL.QTY FACTORY_PRICE,
                          DTL.AMOUNT REAL_BUY_AMOUNT,
                          DTL.QTY * DTL.CUSTOMER_SETTLE_PRICE CUSTOMER_SETTLE_AMOUNT,
                          NVL(ODS.PLATFORM_BEAR_AMOUNT, 0) AS PLATFORM_BEAR_AMOUNT,
                          CASE
                          WHEN MAIN.OUT_DATE >= TO_DATE('2025-03-01', 'YYYY-MM-DD') THEN DTL.AMOUNT - NVL(DTL.BILLING_AMOUNT, 0)
                          WHEN MAIN.BIZ_TYPE_CODE = 'TSC_TXD'
                          OR OME.BIZ_TYPE_CODE = 'PREPAY'
                          OR MAIN.SYSTEM_SOURCE = 20 THEN ROUND(
                            NVL(DTL.DISCOUNT, 0) / 100 * DECODE(
                              DTL.BALANCE_BASE,
                              1,
                              DTL.TAG_PRICE * DTL.QTY,
                              DTL.AMOUNT
                            ),
                            2
                          )
                          WHEN MAIN.OUT_DATE >= TO_DATE('2025-03-01', 'YYYY-MM-DD') THEN DTL.AMOUNT - NVL(DTL.BILLING_AMOUNT, 0)
                          ELSE 0
                        END
                          AS DEDUCTIONS,
                          CASE
                          WHEN MAIN.ORDER_SOURCE = 23 THEN 10
                          ELSE 20
                        END
                          AS TEMP_ORDER_SOURCE,
                          CASE
                          WHEN MAIN.BIZ_TYPE_CODE = 'TSC_TXD' THEN 1
                          ELSE 0
                        END
                          IS_TSC_TXD,
                          (
                            CASE
                            WHEN MAIN.BIZ_TYPE_CODE = 'TSC_TXD' THEN 2
                            WHEN OME.BIZ_TYPE_CODE = 'PREPAY' THEN 3
                            WHEN MAIN.SYSTEM_SOURCE = 20 THEN 4
                            WHEN MAIN.SYSTEM_SOURCE = 19 THEN 5
                            WHEN MAIN.ORDER_SOURCE = 23 THEN 1
                            WHEN MAIN.SYSTEM_SOURCE = 22 THEN 6
                            WHEN MAIN.SYSTEM_SOURCE = 124 THEN 7
                            WHEN MAIN.SYSTEM_SOURCE = 125 THEN 8
                            ELSE -1
                            END
                          ) INNER_CONFIG_TYPE,
                          (NVL(DPOS.CHANNEL_FLAG, 0)) AS CHANNEL_FLAG,
                          DPOS.ONLINE_OFFLINE_CATE_NAME1 AS CHANNEL_FLAG_NAME,
                          MAIN.SHOP_NO AS TMP_REAL_SHOP_NO,
                          NULL AS REAL_SHOP_NO,
                          NULL AS REAL_SHORT_NAME,
                          CASE
                          WHEN ODS.BRAND_UNIT_COST IS NULL
                          OR ODS.BRAND_UNIT_COST = 0 THEN NVL(DTL.UNIT_COST, 0) * NVL(DTL.QTY, 0)
                          ELSE NVL(ODS.BRAND_UNIT_COST, 0) * NVL(DTL.QTY, 0)
                        END
                          AS SUM_BRAND_UNIT_COST
                        FROM
                          INSIDE_PURCHASE_BALANCE_DATE IPB
                          JOIN COMPANY C ON IPB.COMPANY_NO = C.COMPANY_NO
                          JOIN ORDER_MAIN MAIN ON IPB.COMPANY_NO = MAIN.COMPANY_NO
                          AND MAIN.OUT_DATE BETWEEN IPB.BALANCE_START_DATE
                          AND LAST_DAY(IPB.BALANCE_END_DATE)
                          JOIN SHOP S ON MAIN.SHOP_NO = S.SHOP_NO
                          JOIN ORGAN O ON S.BIZ_CITY_NO = O.ORGAN_NO
                          JOIN ORGAN O2 ON O.PARENT_NO = O2.ORGAN_NO
                          JOIN ORDER_DTL DTL ON MAIN.ORDER_NO = DTL.ORDER_NO
                          LEFT JOIN ORDER_MAIN_EXTEND OME ON OME.ORDER_NO = MAIN.ORDER_NO
                          LEFT JOIN RETAIL_FAS.DWS_FACT_DAY_POS_ORD_SMALL DPOS ON DPOS.ORDER_DTL_ID = DTL.ID
                          LEFT JOIN ORDER_DTL_SUPPLEMENT ODS ON ODS.DTL_ID = DTL.ID
                        WHERE
                          (
                            1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 1
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                          )
                          AND IPB.BILL_TYPE = 1
                          AND IPB.COMPANY_NO IN ('E9002')
                          AND IPB.BALANCE_MONTH >= REPLACE(SUBSTR('2025-09-01', 0, 7), '-', '')
                          AND IPB.BALANCE_MONTH <= REPLACE(SUBSTR('2025-10-31', 0, 7), '-', '')
                          AND MAIN.SHARDING_FLAG = 'U010102_E'
                          AND DTL.SHARDING_FLAG = 'U010102_E'
                          AND MAIN.STATUS IN ('30', '41')
                          AND MAIN.BUSINESS_TYPE IN ('3')
                        UNION ALL
                        SELECT
                          O.ZONE_NO,
                          C.COMPANY_NO,
                          C.NAME AS COMPANY_NAME,
                          S.PROVINCE_NO,
                          O.PARENT_NO AS ORGAN_NO,
                          S.BIZ_CITY_NO,
                          (
                            CASE
                            WHEN INSTR('LNDQXZ,LNZQXZ,LNXQXZ,LNBQXZ', DTL.SHOP_NO) > 0 THEN DTL.SHOP_NO
                            WHEN S.SALE_MODE = '05' THEN (
                              CASE
                              WHEN DTL.BRAND_UNIT_NO = 'MT'
                              OR SUBSTR(S.SHOP_NO, 1, 2) = 'MT' THEN CONCAT('MT', SUBSTR(O.PARENT_NO, -4)) || MAIN.COMPANY_NO || 'TG'
                              WHEN DTL.BRAND_UNIT_NO = 'NK'
                              AND INSTR('E9002,C9008', MAIN.COMPANY_NO) > 0
                              AND O.PARENT_NO = 'M0316' THEN DTL.BRAND_UNIT_NO || SUBSTR(O.PARENT_NO, -4) || MAIN.COMPANY_NO || 'TG'
                              ELSE CONCAT(DTL.BRAND_UNIT_NO, SUBSTR(O.PARENT_NO, -4)) || MAIN.COMPANY_NO || 'TG'
                              END
                            )
                            ELSE (
                              CASE
                              WHEN DTL.BRAND_UNIT_NO = 'MT'
                              OR SUBSTR(S.SHOP_NO, 1, 2) = 'MT' THEN CONCAT('MT', SUBSTR(O.PARENT_NO, -4)) || MAIN.COMPANY_NO
                              WHEN DTL.BRAND_UNIT_NO = 'NK'
                              AND INSTR('E9002,C9008', MAIN.COMPANY_NO) > 0
                              AND O.PARENT_NO = 'M0316' THEN DTL.BRAND_UNIT_NO || SUBSTR(O.PARENT_NO, -4) || MAIN.COMPANY_NO
                              ELSE CONCAT(DTL.BRAND_UNIT_NO, SUBSTR(O.PARENT_NO, -4)) || MAIN.COMPANY_NO
                              END
                            )
                            END
                          ) AS SHOP_NO,
                          (
                            CASE
                            WHEN INSTR('LNDQXZ,LNZQXZ,LNXQXZ,LNBQXZ', DTL.SHOP_NO) > 0 THEN DTL.SHOP_NAME
                            WHEN S.SALE_MODE = '05' THEN (
                              CASE
                              WHEN DTL.BRAND_UNIT_NO = 'MT'
                              OR SUBSTR(S.SHOP_NO, 1, 2) = 'MT' THEN O2.NAME || '�Ź���' || 'MT'
                              ELSE O2.NAME || '�Ź���' || DTL.BRAND_UNIT_NO
                              END
                            )
                            ELSE (
                              CASE
                              WHEN DTL.BRAND_UNIT_NO = 'MT'
                              OR SUBSTR(S.SHOP_NO, 1, 2) = 'MT' THEN O2.NAME || '��˾��' || 'MT'
                              ELSE O2.NAME || '��˾��' || DTL.BRAND_UNIT_NO
                              END
                            )
                            END
                          ) AS SHORT_NAME,
                          S.MAJOR,
                          S.STARTUP_TIME,
                          S.SHOP_LEVEL,
                          S.CATEGORY_CODE,
                          S.MALL_NO,
                          S.FULL_NAME,
                          S.SHOP_CLASSIFY,
                          S.OPEN_DATE,
                          S.EMPLOYE_AMOUNT,
                          S.AREA,
                          S.AREA_LEFT,
                          S.AREA_TOTAL,
                          S.REGION_NO,
                          CASE
                          WHEN S.SALE_MODE = '05' THEN '05'
                          ELSE '07'
                        END
                          AS SALE_MODE,
                          CASE
                          WHEN SUBSTR(DTL.BRAND_NO, 1, 2) = 'MT'
                          OR SUBSTR(S.SHOP_NO, 1, 2) = 'MT' THEN '0502'
                          ELSE '0501'
                        END
                          AS RETAIL_TYPE,
                          CASE
                          WHEN S.SALE_MODE = '05' THEN '050107'
                          ELSE '070301'
                        END
                          AS MULTI,
                          S.CHANNEL_NO,
                          S.STATUS,
                          IPB.ID AS BALCANCE_DATE_ID,
                          IPB.BALANCE_MONTH AS MONTH,
                          IPB.BALANCE_START_DATE,
                          IPB.BALANCE_END_DATE,
                          DTL.REAL_BUY_AMOUNT AS REAL_BUY_AMOUNT1,
                          DTL.SURPLUS_AMOUNT AS SURPLUS_AMOUNT,
                          (
                            NVL(DTL.SURPLUS_AMOUNT, 0) - NVL(DTL.REAL_BUY_AMOUNT, 0)
                          ) AS VOUCHER_DIFFERENCE,
                          DTL.ID,
                          MAIN.BUSINESS_NO AS REL_NO,
                          MAIN.OUT_DATE AS SALE_DATE,
                          DTL.ITEM_NO,
                          DTL.BRAND_NO,
                          DTL.BRAND_NAME,
                          SUBSTR(DTL.BRAND_NO, 1, 2) AS BRAND_UNIT_NO,
                          SUBSTR(DTL.CATEGORY_NO, 1, 2) AS CATEGORY_NO,
                          DTL.QTY,
                          DTL.AMOUNT AS REAL_AMOUNT,
                          DECODE(
                            DTL.BALANCE_BASE,
                            1,
                            DTL.TAG_PRICE * DTL.QTY,
                            DTL.AMOUNT
                          ) AS AMOUNT,
                          DTL.TAG_PRICE,
                          NVL(DTL.DISCOUNT, 0) AS DISCOUNT,
                          DTL.TAG_PRICE * DTL.QTY AS SUM_TAG_PRICE,
                          DTL.UNIT_COST * DTL.QTY AS SUM_UNIT_COST,
                          DTL.REGION_COST * DTL.QTY AS SUM_REGION_COST,
                          DTL.HEADQUARTER_COST * DTL.QTY AS SUM_HEADQUARTER_COST,
                          DTL.PURCHASE_PRICE * DTL.QTY AS SUM_PURCHASE_PRICE,
                          DTL.FACTORY_PRICE * DTL.QTY FACTORY_PRICE,
                          DTL.AMOUNT REAL_BUY_AMOUNT,
                          DTL.QTY * DTL.CUSTOMER_SETTLE_PRICE CUSTOMER_SETTLE_AMOUNT,
                          NVL(ODS.PLATFORM_BEAR_AMOUNT, 0) AS PLATFORM_BEAR_AMOUNT,
                          CASE
                          WHEN MAIN.OUT_DATE >= TO_DATE('2025-03-01', 'YYYY-MM-DD') THEN DTL.AMOUNT - NVL(DTL.BILLING_AMOUNT, 0)
                          WHEN MAIN.BIZ_TYPE_CODE = 'TSC_TXD'
                          OR OME.BIZ_TYPE_CODE = 'PREPAY'
                          OR MAIN.SYSTEM_SOURCE = 20 THEN ROUND(
                            NVL(DTL.DISCOUNT, 0) / 100 * DECODE(
                              DTL.BALANCE_BASE,
                              1,
                              DTL.TAG_PRICE * DTL.QTY,
                              DTL.AMOUNT
                            ),
                            2
                          )
                          WHEN MAIN.OUT_DATE >= TO_DATE('2025-03-01', 'YYYY-MM-DD') THEN DTL.AMOUNT - NVL(DTL.BILLING_AMOUNT, 0)
                          ELSE 0
                        END
                          AS DEDUCTIONS,
                          CASE
                          WHEN MAIN.ORDER_SOURCE = 23 THEN 10
                          ELSE 20
                        END
                          AS TEMP_ORDER_SOURCE,
                          CASE
                          WHEN MAIN.BIZ_TYPE_CODE = 'TSC_TXD' THEN 1
                          ELSE 0
                        END
                          IS_TSC_TXD,
                          (
                            CASE
                            WHEN MAIN.BIZ_TYPE_CODE = 'TSC_TXD' THEN 2
                            WHEN OME.BIZ_TYPE_CODE = 'PREPAY' THEN 3
                            WHEN MAIN.SYSTEM_SOURCE = 20 THEN 4
                            WHEN MAIN.SYSTEM_SOURCE = 19 THEN 5
                            WHEN MAIN.ORDER_SOURCE = 23 THEN 1
                            WHEN MAIN.SYSTEM_SOURCE = 22 THEN 6
                            WHEN MAIN.SYSTEM_SOURCE = 124 THEN 7
                            WHEN MAIN.SYSTEM_SOURCE = 125 THEN 8
                            ELSE -1
                            END
                          ) INNER_CONFIG_TYPE,
                          NVL(DPOS.CHANNEL_FLAG, 0) AS CHANNEL_FLAG,
                          DPOS.ONLINE_OFFLINE_CATE_NAME1 AS CHANNEL_FLAG_NAME,
                          MAIN.SHOP_NO AS TMP_REAL_SHOP_NO,
                          NULL AS REAL_SHOP_NO,
                          NULL AS REAL_SHORT_NAME,
                          CASE
                          WHEN ODS.BRAND_UNIT_COST IS NULL
                          OR ODS.BRAND_UNIT_COST = 0 THEN NVL(DTL.UNIT_COST, 0) * NVL(DTL.QTY, 0)
                          ELSE NVL(ODS.BRAND_UNIT_COST, 0) * NVL(DTL.QTY, 0)
                        END
                          AS SUM_BRAND_UNIT_COST
                        FROM
                          INSIDE_PURCHASE_BALANCE_DATE IPB
                          JOIN COMPANY C ON IPB.COMPANY_NO = C.COMPANY_NO
                          JOIN RETURN_EXCHANGE_MAIN MAIN ON IPB.COMPANY_NO = MAIN.COMPANY_NO
                          AND MAIN.OUT_DATE BETWEEN IPB.BALANCE_START_DATE
                          AND LAST_DAY(IPB.BALANCE_END_DATE)
                          JOIN SHOP S ON MAIN.SHOP_NO = S.SHOP_NO
                          JOIN ORGAN O ON S.BIZ_CITY_NO = O.ORGAN_NO
                          JOIN ORGAN O2 ON O.PARENT_NO = O2.ORGAN_NO
                          JOIN RETURN_EXCHANGE_DTL DTL ON MAIN.BUSINESS_NO = DTL.BUSINESS_NO
                          LEFT JOIN ORDER_MAIN_EXTEND OME ON OME.ORDER_NO = MAIN.BUSINESS_NO
                          LEFT JOIN RETAIL_FAS.DWS_FACT_DAY_POS_ORD_SMALL DPOS ON DPOS.ORDER_DTL_ID = DTL.ID
                          LEFT JOIN ORDER_DTL_SUPPLEMENT ODS ON ODS.DTL_ID = DTL.ID
                        WHERE
                          (
                            1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 1
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                          )
                          AND IPB.BILL_TYPE = 1
                          AND IPB.COMPANY_NO IN ('E9002')
                          AND IPB.BALANCE_MONTH >= REPLACE(SUBSTR('2025-09-01', 0, 7), '-', '')
                          AND IPB.BALANCE_MONTH <= REPLACE(SUBSTR('2025-10-31', 0, 7), '-', '')
                          AND MAIN.SHARDING_FLAG = 'U010102_E'
                          AND DTL.SHARDING_FLAG = 'U010102_E'
                          AND MAIN.STATUS IN ('30', '41')
                          AND MAIN.BUSINESS_TYPE IN ('3')
                        UNION ALL
                        SELECT
                          BSB.ZONE_NO_FROM AS ZONE_NO,
                          BSB.SALER_NO AS COMPANY_NO,
                          BSB.SALER_NAME AS COMPANY_NAME,
                          NULL AS PROVINCE_NO,
                          BSB.ORGAN_NO_FROM AS ORGAN_NO,
                          NULL AS BIZ_CITY_NO,
                          CASE
                          WHEN BSB.BRAND_UNIT_NAME = '��Ʒ' THEN CONCAT('MT', SUBSTR(BSB.ORGAN_NO_FROM, -4)) || BSB.SALER_NO
                          WHEN BSB.BRAND_UNIT_NO = 'NK'
                          AND BSB.ORGAN_NO_FROM = 'M0316'
                          AND INSTR('E9002,C9008', BSB.SALER_NO) > 0 THEN CONCAT(BSB.BRAND_UNIT_NO, SUBSTR(BSB.ORGAN_NO_FROM, -4)) || BSB.SALER_NO
                          ELSE CASE SUBSTR(BSB.BUYER_NO, 1, 2)
                          WHEN 'MT' THEN CONCAT('MT', SUBSTR(BSB.ORGAN_NO_FROM, -4)) || BSB.SALER_NO
                          ELSE CONCAT(BSB.BRAND_UNIT_NO, SUBSTR(BSB.ORGAN_NO_FROM, -4)) || BSB.SALER_NO
                        END
                        END
                          AS SHOP_NO,
                          CASE
                          WHEN BSB.BRAND_UNIT_NAME = '��Ʒ' THEN BSB.ORGAN_NAME_FROM || '��˾��' || 'MT'
                          ELSE BSB.ORGAN_NAME_FROM || '��˾��' || BSB.BRAND_UNIT_NO
                        END
                          AS SHORT_NAME,
                          NULL AS MAJOR,
                          NULL AS STARTUP_TIME,
                          NULL AS SHOP_LEVEL,
                          NULL AS CATEGORY_CODE,
                          NULL AS MALL_NO,
                          NULL AS FULL_NAME,
                          NULL AS SHOP_CLASSIFY,
                          NULL AS OPEN_DATE,
                          NULL AS EMPLOYE_AMOUNT,
                          NULL AS AREA,
                          NULL AS AREA_LEFT,
                          NULL AS AREA_TOTAL,
                          NULL AS REGION_NO,
                          '07' AS SALE_MODE,
                          CASE
                          WHEN BSB.BRAND_UNIT_NO = 'MT' THEN '0502'
                          ELSE '0501'
                        END
                          AS RETAIL_TYPE,
                          '070301' AS MULTI,
                          NULL AS CHANNEL_NO,
                          NULL AS STATUS,
                          IPB.ID AS BALCANCE_DATE_ID,
                          IPB.BALANCE_MONTH AS MONTH,
                          IPB.BALANCE_START_DATE,
                          IPB.BALANCE_END_DATE,
                          0 REAL_BUY_AMOUNT1,
                          0 SURPLUS_AMOUNT,
                          0 VOUCHER_DIFFERENCE,
                          BSB.ID,
                          BSB.BILL_NO AS REL_NO,
                          BSB.SEND_DATE AS SALE_DATE,
                          BSB.ITEM_NO,
                          BSB.BRAND_NO,
                          BSB.BRAND_NAME,
                          BSB.BRAND_UNIT_NO,
                          SUBSTR(BSB.CATEGORY_NO, 0, 2) AS CATEGORY_NO,
                          BSB.SEND_QTY AS QTY,
                          BSB.SEND_QTY * COST AS REAL_AMOUNT,
                          BSB.SEND_QTY * COST AS AMOUNT,
                          BSB.TAG_PRICE AS TAG_PRICE,
                          0 AS DISCOUNT,
                          BSB.TAG_PRICE * BSB.SEND_QTY AS SUM_TAG_PRICE,
                          BSB.UNIT_COST * BSB.SEND_QTY AS SUM_UNIT_COST,
                          BSB.REGION_COST * BSB.SEND_QTY AS SUM_REGION_COST,
                          BSB.HEADQUARTER_COST * BSB.SEND_QTY AS SUM_HEADQUARTER_COST,
                          BSB.PURCHASE_PRICE * BSB.SEND_QTY AS SUM_PURCHASE_PRICE,
                          BSB.FACTORY_PRICE * BSB.SEND_QTY FACTORY_PRICE,
                          BSB.SEND_QTY * COST REAL_BUY_AMOUNT,
                          BSB.SEND_QTY * COST CUSTOMER_SETTLE_AMOUNT,
                          0 AS PLATFORM_BEAR_AMOUNT,
                          0 AS DEDUCTIONS,
                          NULL AS TEMP_ORDER_SOURCE,
                          0 AS IS_TSC_TXD,
                          -1 AS INNER_CONFIG_TYPE,
                          CASE
                          WHEN BSB.SEND_DATE < TO_DATE('2025-05-01', 'YYYY-MM-DD') THEN DECODE(BSB.SALER_NO, 'Z9005', 4, 9)
                          WHEN BSB.SALER_NO IN ('Z9005', 'Z9108', 'Z9103') THEN 4
                          ELSE 9
                        END
                          AS CHANNEL_FLAG,
                          NULL AS CHANNEL_FLAG_NAME,
                          '-1' AS TMP_REAL_SHOP_NO,
                          NULL AS REAL_SHOP_NO,
                          NULL AS REAL_SHORT_NAME,
                          CASE
                          WHEN BSBE.BRAND_UNIT_COST IS NULL
                          OR BSBE.BRAND_UNIT_COST = 0 THEN NVL(BSB.UNIT_COST, 0) * NVL(BSB.SEND_QTY, 0)
                          ELSE NVL(BSBE.BRAND_UNIT_COST, 0) * NVL(BSB.SEND_QTY, 0)
                        END
                          AS SUM_BRAND_UNIT_COST
                        FROM
                          INSIDE_PURCHASE_BALANCE_DATE IPB
                          JOIN BILL_SALE_BALANCE BSB ON IPB.COMPANY_NO = BSB.SALER_NO
                          AND BSB.SEND_DATE BETWEEN IPB.BALANCE_START_DATE
                          AND LAST_DAY(IPB.BALANCE_END_DATE)
                          JOIN ORGAN O ON O.ORGAN_NO = BSB.ORGAN_NO_FROM
                          LEFT JOIN BILL_SALE_BALANCE_EXTEND BSBE ON BSBE.BILL_NO = BSB.BILL_NO
                          AND BSBE.ITEM_NO = BSB.ITEM_NO
                        WHERE
                          (
                            1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR 1 = 2
                            OR (
                              BSB.BILL_TYPE = '1335'
                              AND BSB.BIZ_TYPE = '23'
                            )
                            OR (
                              BSB.BILL_TYPE = '1335'
                              AND BSB.BIZ_TYPE = '24'
                            )
                            OR (
                              BSB.BILL_TYPE = '1335'
                              AND BSB.BIZ_TYPE = '2'
                            )
                            OR (
                              BSB.BILL_TYPE = '1355'
                              AND BSB.BIZ_TYPE = '8'
                            )
                            OR (
                              BSB.BILL_TYPE = '1355'
                              AND BSB.BIZ_TYPE = '10'
                            )
                            OR (
                              BSB.BILL_TYPE = '1355'
                              AND BSB.BIZ_TYPE = '26'
                            )
                            OR (BSB.BILL_TYPE = 1342)
                            OR (
                              BSB.BILL_TYPE = '1335'
                              AND BSB.BIZ_TYPE = '13'
                            )
                            OR (
                              BSB.BILL_TYPE = '1335'
                              AND BSB.BIZ_TYPE = '69'
                            )
                          )
                          AND IPB.BILL_TYPE = 1
                          AND BSB.SALER_NO IN ('E9002')
                          AND IPB.BALANCE_MONTH >= REPLACE(SUBSTR('2025-09-01', 0, 7), '-', '')
                          AND IPB.BALANCE_MONTH <= REPLACE(SUBSTR('2025-10-31', 0, 7), '-', '')
                      ) A
                      LEFT JOIN INVOICE_APPLY_CONFIRM_DTL IACD ON A.ID = IACD.ORDER_DTL_ID
                      AND A.REL_NO = IACD.ORDER_NO
                      AND NVL(A.ITEM_NO, '-1') = NVL(IACD.ITEM_NO, '-1')
                    WHERE
                      1 = 1
                      AND (
                        A.INNER_CONFIG_TYPE = -1
                        OR NOT EXISTS (
                          SELECT
                            1
                          FROM
                            INNER_BUY_CONFIG IBC
                          WHERE
                            IBC.COMPANY_NO = A.COMPANY_NO
                            AND IBC.SHOP_NO = A.TMP_REAL_SHOP_NO
                            AND IBC.BRAND_UNIT_NO = A.BRAND_UNIT_NO
                            AND A.SALE_DATE BETWEEN IBC.SALE_START_DATE
                            AND IBC.SALE_END_DATE
                            AND IBC.CONFIG_TYPE = A.INNER_CONFIG_TYPE
                        )
                      )
                  ) A1
                GROUP BY
                  A1.COMPANY_NO,
                  A1.ORGAN_NO,
                  A1.SHOP_NO,
                  A1.BALCANCE_DATE_ID,
                  A1.BRAND_UNIT_NO,
                  A1.CATEGORY_NO,
                  A1.CHANNEL_FLAG
              ) A2
              JOIN (
                SELECT
                  LISTAGG(CATEGORY_NO, ',') WITHIN GROUP (
                    ORDER BY
                      CATEGORY_NO
                  ) CATEGORY_NOS,
                  FINANCIAL_CATEGORY_NAME
                FROM
                  CATEGORY
                WHERE
                  LEVELID = 1
                  /*SYS_NO*/
                  AND SYS_NO = 'U010102'
                GROUP BY
                  FINANCIAL_CATEGORY_NAME
              ) CATEGORY ON 1 = 1
            GROUP BY
              A2.COMPANY_NO,
              A2.ORGAN_NO,
              A2.SHOP_NO,
              A2.BALCANCE_DATE_ID,
              A2.BRAND_UNIT_NO,
              A2.CHANNEL_FLAG,
              CATEGORY.FINANCIAL_CATEGORY_NAME
            ORDER BY
              A2.ORGAN_NO,
              A2.SHOP_NO,
              A2.BALCANCE_DATE_ID,
              A2.BRAND_UNIT_NO,
              A2.CHANNEL_FLAG,
              CATEGORY.FINANCIAL_CATEGORY_NAME
          ) A3
          LEFT JOIN SHOP_NAME_REPLACE SNR ON SNR.SHOP_NO = A3.SHOP_NO
          AND SNR.BRAND_UNIT_NO = A3.BRAND_UNIT_NO
        WHERE
          1 = 1
          AND ROWNUM <= '0' + '2147483647'
      ) TB
    WHERE
      RN > '0'
  ) TEMP
  LEFT JOIN (
    SELECT
      SB.SHOP_NO,
      B.SYS_NO,
      MAX(SB.BRAND_FLAG) BRAND_FLAG
    FROM
      SHOP_BRAND SB
      INNER JOIN BRAND B ON SB.BRAND_NO = B.BRAND_NO
    GROUP BY
      SB.SHOP_NO,
      B.SYS_NO
  ) T0 ON T0.SHOP_NO = TEMP.SHOP_NO
  AND T0.SYS_NO = TEMP.BRAND_UNIT_NO
  LEFT JOIN ORGAN G ON TEMP.ORGAN_NO = G.ORGAN_NO
  LEFT JOIN ORGAN BG ON TEMP.BIZ_CITY_NO = BG.ORGAN_NO
  LEFT JOIN ZONE_INFO Z ON TEMP.ZONE_NO = Z.ZONE_NO
  LEFT JOIN MALL M ON TEMP.MALL_NO = M.MALL_NO
  LEFT JOIN SHOP S ON S.SHOP_NO = TEMP.SHOP_NO
  LEFT JOIN BSGROUPS B ON M.BSGROUPS_NO = B.BSGROUPS_NO
  LEFT JOIN REGION R ON TEMP.REGION_NO = R.REGION_NO
  LEFT JOIN BRAND_UNIT BU ON TEMP.BRAND_UNIT_NO = BU.BRAND_UNIT_NO
  LEFT JOIN SALES_CHANNEL LE7 ON TEMP.CHANNEL_NO = LE7.CHANNEL_NO
ORDER BY
  TEMP.COMPANY_NO,
  TEMP.ORGAN_NO,
  TEMP.SHOP_NO,
  TEMP.BALCANCE_DATE_ID,
  TEMP.BRAND_UNIT_NO,
  CATEGORY_NAME;
`
console.time('split')
const doc = new SQLDocument(
    {
        text: sql,
        delimiter: ';',
        
    }
);
console.timeEnd('split')
console.time('parse')
const result = doc.statements[0].parse(0, function (_tokens, _currentRules, _followRules, _tokenStack) {
    
});
console.timeEnd('parse')
console.log(result.result)

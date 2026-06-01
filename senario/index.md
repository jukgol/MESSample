# 라면 제조 공정 기반 MES 시나리오 (senario/index.md)

본 시나리오는 누구나 직관적으로 이해할 수 있는 **"라면(신라면) 제조 공정"**을 모델로 삼아, MES(제조실행시스템)의 데이터 흐름과 비즈니스 로직을 단계별로 검증하기 위한 가이드입니다.

각 단계의 세부 시나리오 정보는 링크를 눌러 개별 파일에서 확인하실 수 있습니다.

---

## 📌 전체 시나리오 흐름도 (Sequence)

```
[1. 공정 정의 (Process)] ➡️ [2. 레시피 설계 (BOM)] ➡️ [3. 품목 도출 (Item)] ➡️ [4. 실물 입고 (Lot)] ➡️ [5. 생산 가동 (Run)] ➡️ [6. QC & 출하]
```

---

## 📂 세부 단계별 시나리오 문서 바로가기

1. **[Step 1: 공정 정의 (Process Step)](file:///f:/ProjectGit/MESSample/senario/step1_process.md)**
   * 공장에서 라면을 만들기 위해 필요한 물리적 가공 경로와 단계들을 설계합니다.
2. **[Step 2: 레시피 설계 (BOM)](file:///f:/ProjectGit/MESSample/senario/step2_bom.md)**
   * 정의한 공정의 각 단계에 맞춰, 어떤 조합으로 라면이 조리/조립되는지 정의합니다.
3. **[Step 3: 품목 도출 (Item)](file:///f:/ProjectGit/MESSample/senario/step3_item.md)**
   * BOM 레시피를 실현하기 위해 우리 시스템이 인식하고 관리해야 하는 품목(Item) 목록을 도출합니다.
4. **[Step 4: 실물 입고 (Lot)](file:///f:/ProjectGit/MESSample/senario/step4_lot.md)**
   * 정의된 Item 정보를 바탕으로 실제 공장에 존재하는 자재의 물리적 묶음(Lot)들을 등록합니다.
5. **[Step 5: 생산 가동 및 실시간 Lot 추적 (Run)](file:///f:/ProjectGit/MESSample/senario/step5_run.md)**
   * 라인을 기동하여 실제로 자재를 소모하고 완제품 Lot을 생산하며 이력을 남기는 과정을 검증합니다.
6. **[Step 6: 품질 검사 (QC) 및 출하 (Shipment)](file:///f:/ProjectGit/MESSample/senario/step6_qc_shipment.md)**
   * 완성된 Lot의 품질을 합격시키고 최종 출하하여 판매 완료하는 비즈니스 룰을 검증합니다.

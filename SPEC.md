# 產品目標（純前端版）

- 使用者在瀏覽器中管理訂閱紀錄（資料存在 LocalStorage）。
- 提供每月日曆視圖，顯示扣款日期與金額。
- 支援新增、編輯、刪除、暫停訂閱，並即時反映在月曆上。
- 資料僅儲存在本機，重新整理仍保留；不同裝置、瀏覽器不會同步（除非手動匯入/匯出）。

## 功能需求（MVP）

### A. 月曆視圖

- 單月格狀日曆（週一或週日開始可設定，預設週一）。
- 每日格顯示當日扣款項目（emoji + 名稱 + 金額）。
- 頂部摘要：本月總支出、下月預估支出。
- 支援切換月份與「回到本月」。
- 點擊日期顯示該日訂閱清單。

### B. 訂閱管理

- 新增訂閱：
  - 必填：名稱、emoji、金額、幣別、週期、首扣日期。
  - 選填：服務網址、付款方式、標籤、備註、顏色。
  - 週期：每週、每月、每年、每 X 個月。
  - 少天月份策略：向前至月底（預設）。
  - 狀態：active / paused / canceled / trial。
- 編輯訂閱：直接更新 LocalStorage 中的資料。
- 刪除訂閱：從 LocalStorage 移除，並重新渲染月曆。

### C. 資料儲存（LocalStorage）

- Key 命名範例：
  - `subscriptions` → 陣列，存所有訂閱設定
  - `charges` → 陣列，存生成的扣款紀錄
- 結構範例：

```json
{
  "subscriptions": [
    {
      "id": "sub_1",
      "name": "Netflix",
      "emoji": "🎬",
      "amount": 390,
      "currency": "TWD",
      "cycleType": "monthly",
      "cycleInterval": 1,
      "anchorDate": "2025-08-05",
      "carryStrategy": "end_of_month",
      "status": "active",
      "vendorUrl": "https://www.netflix.com",
      "paymentMethod": "credit_card",
      "notes": "",
      "color": "#FF0000",
      "tags": ["影音"]
    }
  ],
  "charges": [
    {
      "subscriptionId": "sub_1",
      "chargeDate": "2025-08-05",
      "amount": 390,
      "currency": "TWD",
      "status": "projected"
    }
  ]
}
```

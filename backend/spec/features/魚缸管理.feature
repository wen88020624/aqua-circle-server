Feature: 魚缸管理
  為了管理魚缸生命週期
  使用者可以建立、查詢與刪除魚缸
  並且可以用前置條件與後置條件描述完整 E2E 行為

  Rule: 建立魚缸時需符合欄位規則
    Scenario: 魚缸長度、寬度、高度皆 > 0，成功建立
      Given 建立魚缸請求資料如下
        | name   | length | width | height | status | setupDate  | notes |
        | 測試魚缸 | 100    | 50    | 60     | 開缸     | 2025-01-01 |      |
      When 使用者建立新的魚缸
      Then HTTP 回應應為
        | statusCode |
        | 201        |
      And 資料庫中的魚缸資料應為
        | name   | length | width | height | status | setupDate  |
        | 測試魚缸 | 100    | 50    | 60     | 開缸     | 2025-01-01 |

    Scenario Outline: 必填欄位與數值不合法時，建立魚缸失敗
      Given 建立魚缸請求資料如下
        | name   | length | width | height | status | setupDate  | notes |
        | 測試魚缸 | <length> | <width> | <height> | <status> | <setupDate> |      |
      When 使用者建立新的魚缸
      Then HTTP 回應應為
        | statusCode | message |
        | 400        | <message> |
      And 資料庫中應不存在名稱為「<name>」的魚缸

      Examples:
        | name   | length | width | height | status | setupDate  | message                                 |
        | 測試魚缸 | -100   | 50    | 60     | 開缸     | 2025-01-01 | 魚缸建立失敗，長度、寬度、高度皆須 > 0 |
        | 測試魚缸 | 100    | 50    | 60     |        | 2025-01-01 | 魚缸建立失敗，狀態不能為空             |
        | 測試魚缸 | 100    | 50    | 60     | 開缸     |           | 魚缸建立失敗，開缸日期不能為空         |
        | 測試魚缸 |       | 50    | 60     | 開缸     | 2025-01-01 | 魚缸建立失敗，長度、寬度、高度皆須 > 0 |

  Rule: 使用者可以查詢所有魚缸
    Scenario: 魚缸存在，查詢所有魚缸成功
      Given 系統初始魚缸資料如下
        | name | length | width | height | status | setupDate  | notes |
        | 魚缸 1 | 100    | 50    | 60     | 開缸     | 2025-01-01 | 主缸   |
      When 使用者查詢所有魚缸
      Then HTTP 回應應為
        | statusCode |
        | 200        |
      And 查詢結果應包含魚缸
        | name | length | width | height | status |
        | 魚缸 1 | 100    | 50    | 60     | 開缸     |

    Scenario: 不存在任何魚缸，查詢所有魚缸結果為空
      Given 系統中不存在任何魚缸
      When 使用者查詢所有魚缸
      Then HTTP 回應應為
        | statusCode |
        | 200        |
      And 查詢結果應為空陣列

  Rule: 使用者可以刪除魚缸，且保留關聯資料
    Scenario: 刪除魚缸但保留相關資料
      Given 系統初始魚缸資料如下
        | name | length | width | height | status | setupDate  | notes |
        | 魚缸 1 | 100    | 50    | 60     | 開缸     | 2025-01-01 | 主缸   |
      And 魚缸「魚缸 1」有以下關聯資料
        | relationType | name       | tag  | date       |
        | organism     | 小丑魚      | 海水魚 |            |
        | equipment    | 圓筒過濾器    | 過濾器 |            |
        | waterChange  |            |      | 2025-01-02 |
      When 使用者刪除名稱為「魚缸 1」的魚缸
      Then HTTP 回應應為
        | statusCode |
        | 200        |
      And 資料庫中應不存在名稱為「魚缸 1」的魚缸
      And 關聯資料應保留如下
        | relationType | expectedCount |
        | organism     | 0             |
        | equipment    | 1             |
        | waterChange  | 0             |
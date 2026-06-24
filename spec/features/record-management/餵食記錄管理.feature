Feature: 餵食記錄管理

  為了追蹤魚缸日常餵食狀況
  使用者可以新增、查詢、更新與刪除餵食記錄
  並且僅能選擇 tag 為「飼料」的耗材

  Rule: 新增餵食記錄時只能選擇 tag 為「飼料」的耗材
    Scenario Outline: 新增餵食記錄時檢查耗材 tag
      Given 系統初始耗材資料如下
        | name        | tag   | status |
        | <material>  | <tag> | 正常    |
      And 系統初始魚缸資料如下
        | name |
        | 主缸  |
      When 使用者在魚缸「主缸」中新增餵食記錄，選擇耗材「<material>」
      Then 操作結果應為
        | success   | message                    |
        | <success> | <message>                  |

      Examples:
        | material | tag  | success | message                       |
        | 紅蟲      | 飼料 | true    |                               |
        | 藥品 A    | 藥品 | false   | 只能選擇 tag 為「飼料」的耗材 |
  
  Rule: 新增餵食記錄時檢查耗材狀態，過期飼料給予警告但仍可使用
    Scenario Outline: 新增餵食記錄時檢查飼料有效狀態
      Given 系統初始耗材資料如下
        | name      | tag  | status     |
        | <material> | 飼料 | <status>   |
      And 系統初始魚缸資料如下
        | name |
        | 主缸  |
      When 使用者在魚缸「主缸」中新增餵食記錄，選擇耗材「<material>」
      Then 操作結果應為
        | success | warning                     |
        | true    | <warning>                   |

      Examples:
        | material | status | warning                    |
        | 紅蟲      | 正常    |                            |
        | 魚食 B    | 過期    | 飼料已過期，請注意生物健康 |
  
  Rule: 使用者可以在魚缸中新增餵食記錄，並設定餵食記錄的日期、選擇 tag 為「飼料」的耗材、備註、所屬魚缸
    Scenario Outline: 新增餵食記錄時檢查欄位
      Given 系統初始耗材資料如下
        | name | tag |
        | 紅蟲  | 飼料 |
      And 系統初始魚缸資料如下
        | name |
        | 主缸  |
      And 餵食記錄請求資料如下
        | date   | material | notes     | aquarium |
        | <date> | 紅蟲      | 早上餵食   | 主缸      |
      When 使用者新增餵食記錄
      Then 操作結果應為
        | success   | message                 |
        | <success> | <message>               |

      Examples:
        | date       | success | message                 |
        | 2025-01-01 | true    |                         |
        |            | false   | 餵食記錄的日期不可為空  |
  
  Rule: 使用者可以查詢所有餵食記錄
    Scenario: 查詢所有餵食記錄，系統中存在餵食記錄，查詢成功
      Given 系統初始餵食記錄資料如下
        | id | date       | aquarium |
        | 1  | 2025-01-01 | 主缸      |
        | 2  | 2025-01-02 | 主缸      |
      When 使用者查詢所有餵食記錄
      Then 查詢結果應包含餵食記錄
        | id |
        | 1  |
        | 2  |

    Scenario: 查詢所有餵食記錄，系統中不存在任何餵食記錄，查詢結果為空
      Given 系統中不存在任何餵食記錄
      When 使用者查詢所有餵食記錄
      Then 查詢結果應為空
  
  Rule: 使用者可以查詢特定魚缸中的餵食記錄
    Scenario Outline: 查詢特定魚缸中的餵食記錄
      Given 系統初始餵食記錄資料如下
        | id | date       | aquarium   |
        | 1  | 2025-01-01 | <recordAq> |
        | 2  | 2025-01-02 | <recordAq> |
      When 使用者查詢魚缸「主缸」中的餵食記錄
      Then 查詢結果應為
        | expected |
        | <result> |

      Examples:
        | recordAq | result |
        | 主缸      | 有資料   |
        | 側缸      | 空陣列   |
  
  Rule: 使用者可以更新餵食記錄的日期、使用的飼料、備註、所屬魚缸
    Scenario Outline: 更新餵食記錄時檢查記錄存在與耗材合法性
      Given 系統初始餵食記錄資料如下
        | id   | date       | aquarium |
        | <id> | 2025-01-01 | 主缸      |
      And 系統初始耗材資料如下
        | name      | tag   |
        | <material> | <tag> |
      When 使用者更新餵食記錄 1，選擇耗材「<material>」
      Then 操作結果應為
        | success   | message                    |
        | <success> | <message>                  |

      Examples:
        | id | material | tag  | success | message                       |
        | 1  | 紅蟲      | 飼料 | true    |                               |
        |    | 紅蟲      | 飼料 | false   | 餵食記錄不存在                |
        | 1  | 藥品 A    | 藥品 | false   | 只能選擇 tag 為「飼料」的耗材 |
  
  Rule: 使用者可以刪除餵食記錄
    Scenario: 刪除存在的餵食記錄，刪除成功
      Given 餵食記錄 1 存在
      When 使用者刪除餵食記錄 1
      Then 餵食記錄 1 被刪除

    Scenario: 刪除不存在的餵食記錄，刪除失敗
      Given 餵食記錄 1 不存在
      When 使用者刪除餵食記錄 1
      Then 操作失敗
      And 系統提示「餵食記錄不存在」

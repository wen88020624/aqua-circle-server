Feature: 耗材管理
  為了管理魚缸日常消耗品
  使用者可以新增與更新耗材
  並且可以維護名稱、tag、數量、狀態、金額與所屬魚缸等欄位

  Rule: 新增耗材的數量必須 > 0
    Scenario Outline: 新增耗材時檢查數量
      Given 耗材請求資料如下
        | name | tag | quantity   | amount | status | aquarium |
        | 飼料  | 飼料 | <quantity> | 100    | 使用中   | 主缸      |
      When 使用者新增耗材
      Then 操作結果應為
        | success   | message                 |
        | <success> | <message>               |

      Examples:
        | quantity | success | message                 |
        | 10       | true    |                         |
        | -1       | false   | 耗材的數量必須 > 0      |

  Rule: 新增耗材的tag不可為空
    Scenario Outline: 新增耗材時檢查 tag
      Given 耗材請求資料如下
        | name | tag   | quantity | amount | status | aquarium |
        | 飼料  | <tag> | 10       | 100    | 使用中   | 主缸      |
      When 使用者新增耗材
      Then 操作結果應為
        | success   | message              |
        | <success> | <message>            |

      Examples:
        | tag | success | message              |
        | 藥品 | true    |                      |
        |     | false   | 耗材的tag不可為空    |

  Rule: 新增耗材，數量 > 0，狀態自動更新為「使用中」
    Scenario: 新增耗材且數量 > 0 時，狀態自動為使用中
      Given 耗材請求資料如下
        | name | tag | quantity | amount | aquarium |
        | 飼料  | 飼料 | 10       | 100    | 主缸      |
      When 使用者新增耗材
      Then 耗材狀態應為「使用中」

  Rule: 新增耗材，數量 = 0，狀態自動更新為「用完」
    Scenario: 新增耗材且數量 = 0 時，狀態自動為用完
      Given 耗材請求資料如下
        | name | tag | quantity | amount | aquarium |
        | 飼料  | 飼料 | 0        | 100    | 主缸      |
      When 使用者新增耗材
      Then 耗材狀態應為「用完」
  
  Rule: 更新耗材，耗材必須存在於系統中
    Scenario Outline: 更新耗材時檢查目標耗材是否存在
      Given 系統初始耗材資料如下
        | name           | tag | quantity | amount | status | aquarium |
        | <existingName> | 飼料 | 10       | 100    | 使用中   | 主缸      |
      And 耗材更新資料如下
        | name | tag | quantity | amount | status | aquarium |
        | 飼料  | 飼料 | 10       | 100    | 使用中   | 主缸      |
      When 使用者更新名稱為「飼料」的耗材
      Then 操作結果應為
        | success   | message     |
        | <success> | <message>   |

      Examples:
        | existingName | success | message     |
        | 飼料          | true    | 耗材更新成功 |
        |              | false   | 耗材不存在   |

  Rule: 更新耗材，耗材的tag不可為空
    Scenario: 更新耗材時 tag 為空，更新失敗
      Given 耗材更新資料如下
        | name | tag | quantity | amount | status | aquarium |
        | 飼料  |     | 10       | 100    | 使用中   | 主缸      |
      When 使用者更新耗材
      Then 操作結果應為
        | success | message            |
        | false   | 耗材的tag不可為空  |
  
  Rule: 更新耗材的數量為 0 時，狀態自動更新為「用完」
    Scenario Outline: 更新耗材時依數量調整狀態與合法性
      Given 耗材更新資料如下
        | name | tag | quantity   | amount | status | aquarium |
        | 飼料  | 飼料 | <quantity> | 100    | 使用中   | 主缸      |
      When 使用者更新耗材
      Then 操作結果應為
        | success   | message                    | status    |
        | <success> | <message>                  | <status>  |

      Examples:
        | quantity | success | message                  | status |
        | 0        | true    |                          | 用完    |
        | -1       | false   | 耗材的數量必須 >= 0      |        |

  Rule: 查詢所有耗材，若耗材為空則查詢結果為空
    Scenario: 查詢所有耗材，系統為空時回傳空陣列
      When 使用者查詢所有耗材
      Then 查詢結果為空

  Rule: 耗材金額必須>=0
    Scenario Outline: 新增/更新耗材時檢查金額
      Given 耗材請求資料如下
        | name | tag | quantity | amount   | status | aquarium |
        | 飼料  | 飼料 | 10       | <amount> | 使用中   | 主缸      |
      When 使用者新增/更新耗材
      Then 操作結果應為
        | success   | message                  |
        | <success> | <message>                |

      Examples:
        | amount | success | message                  |
        | 100    | true    |                          |
        | -100   | false   | 耗材的金額必須 >= 0      |
  
  Rule: 使用者更新耗材狀態為「丟棄」
    Scenario Outline: 更新耗材狀態為丟棄時檢查目標是否存在
      Given 系統初始耗材資料如下
        | name           | tag | quantity | amount | status | aquarium |
        | <existingName> | 飼料 | 10       | 100    | 使用中   | 主缸      |
      When 使用者更新名稱為「飼料」的耗材狀態為「丟棄」
      Then 操作結果應為
        | success   | message     | status   |
        | <success> | <message>   | <status> |

      Examples:
        | existingName | success | message   | status |
        | 飼料          | true    |           | 丟棄    |
        |              | false   | 耗材不存在 |        |

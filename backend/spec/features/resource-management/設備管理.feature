Feature: 設備管理
  為了管理魚缸相關設備
  使用者可以新增與更新設備
  並且可以維護名稱、tag、狀態、金額與所屬魚缸等欄位


  Rule: 設備名稱不可為空
    Scenario Outline: 新增/更新設備時檢查名稱
      Given 設備請求資料如下
        | name   | tag | status | amount | aquarium |
        | <name> | 燈具 | 使用中   | 100    | 主缸      |
      When 使用者新增/更新設備
      Then 操作結果應為
        | success   | message                |
        | <success> | <message>              |

      Examples:
        | name | success | message                |
        | 燈具 | true    |                        |
        |      | false   | 設備的名稱不可為空     |
  
  Rule: 狀態不可為空
    Scenario Outline: 新增/更新設備時檢查狀態
      Given 設備請求資料如下
        | name | tag | status   | amount | aquarium |
        | 燈具  | 燈具 | <status> | 100    | 主缸      |
      When 使用者新增/更新設備
      Then 操作結果應為
        | success   | message                |
        | <success> | <message>              |

      Examples:
        | status | success | message                |
        | 使用中  | true    |                        |
        |        | false   | 設備的狀態不可為空     |

  Rule: 新增設備的金額必須 >= 0
    Scenario Outline: 新增/更新設備時檢查金額
      Given 設備請求資料如下
        | name | tag | status | amount   | aquarium |
        | 燈具  | 燈具 | 使用中   | <amount> | 主缸      |
      When 使用者新增/更新設備
      Then 操作結果應為
        | success   | message                |
        | <success> | <message>              |

      Examples:
        | amount | success | message                |
        | 100    | true    |                        |
        | -1     | false   | 設備的金額必須 >= 0    |
  
  Rule: 新增設備的tag不可為空
    Scenario Outline: 新增/更新設備時檢查 tag
      Given 設備請求資料如下
        | name | tag   | status | amount | aquarium |
        | 燈具  | <tag> | 使用中   | 100    | 主缸      |
      When 使用者新增/更新設備
      Then 操作結果應為
        | success   | message              |
        | <success> | <message>            |

      Examples:
        | tag | success | message              |
        | 燈具 | true    |                      |
        |     | false   | 設備的tag不可為空    |
  
  Rule: 更新設備，設備必須存在於系統中
    Scenario Outline: 更新設備時檢查目標設備是否存在
      Given 系統初始設備資料如下
        | name           | tag | status | amount | aquarium |
        | <existingName> | 燈具 | 使用中   | 100    | 主缸      |
      And 設備更新資料如下
        | name | tag | status | amount | aquarium |
        | 燈具  | 燈具 | 使用中   | 100    | 主缸      |
      When 使用者更新名稱為「燈具」的設備
      Then 操作結果應為
        | success   | message    |
        | <success> | <message>  |

      Examples:
        | existingName | success | message   |
        | 燈具          | true    |           |
        |              | false   | 設備不存在 |

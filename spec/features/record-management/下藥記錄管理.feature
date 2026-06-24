Feature: 下藥記錄管理
  為了管理魚缸治療過程
  使用者可以在魚缸中新增與更新下藥記錄
  並且可以記錄藥品名稱、tag、劑量、日期與所屬魚缸

  Rule: 下藥記錄的下藥名稱不可為空
    Scenario Outline: 新增/更新下藥記錄時檢查藥名
      Given 下藥記錄請求資料如下
        | name   | tag   | dosage | date       | aquarium |
        | <name> | 抗生素 | 10     | 2025-01-01 | 主缸      |
      When 使用者新增/更新下藥記錄
      Then 操作結果應為
        | success   | message                     |
        | <success> | <message>                   |

      Examples:
        | name   | success | message                     |
        | 魚膚寧 | true    |                             |
        |        | false   | 下藥記錄的下藥名稱不可為空  |

  Rule: 下藥記錄的tag不可為空
    Scenario Outline: 新增/更新下藥記錄時檢查 tag
      Given 下藥記錄請求資料如下
        | name   | tag   | dosage | date       | aquarium |
        | 魚膚寧 | <tag> | 10     | 2025-01-01 | 主缸      |
      When 使用者新增/更新下藥記錄
      Then 操作結果應為
        | success   | message                |
        | <success> | <message>              |

      Examples:
        | tag   | success | message                |
        | 抗生素 | true    |                        |
        |       | false   | 下藥記錄的tag不可為空  |

  Rule: 下藥記錄的下藥的量不可為空
    Scenario Outline: 新增/更新下藥記錄時檢查劑量
      Given 下藥記錄請求資料如下
        | name   | tag   | dosage   | date       | aquarium |
        | 魚膚寧 | 抗生素 | <dosage> | 2025-01-01 | 主缸      |
      When 使用者新增/更新下藥記錄
      Then 操作結果應為
        | success   | message                       |
        | <success> | <message>                     |

      Examples:
        | dosage | success | message                       |
        | 10     | true    |                               |
        |        | false   | 下藥記錄的下藥的量不可為空    |
  
  Rule: 下藥紀錄的所屬魚缸不可為空
    Scenario Outline: 新增/更新下藥記錄時檢查所屬魚缸
      Given 下藥記錄請求資料如下
        | name   | tag   | dosage | date       | aquarium   |
        | 魚膚寧 | 抗生素 | 10     | 2025-01-01 | <aquarium> |
      When 使用者新增/更新下藥記錄
      Then 操作結果應為
        | success   | message                      |
        | <success> | <message>                    |

      Examples:
        | aquarium | success | message                      |
        | 主缸      | true    |                              |
        |          | false   | 下藥記錄的所屬魚缸不可為空   |

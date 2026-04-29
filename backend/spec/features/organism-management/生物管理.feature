Feature: 生物管理

  為了管理魚缸中的生物資料
  使用者可以新增與更新生物
  並且可以維護名稱、tag、金額、長度與所屬魚缸等欄位

  Rule: 生物名稱不可為空
    Scenario Outline: 新增/更新生物時檢查名稱
      Given 生物請求資料如下
        | name   | tag   | amount | length | aquarium |
        | <name> | 上層魚 | 100    | 10     | 主缸       |
      When 使用者新增/更新生物
      Then 操作結果應為
        | success   | message                   |
        | <success> | <message>                 |

      Examples:
        | name   | success | message               |
        | 小丑魚 | true    |                        |
        |        | false   | 生物的名稱不可為空    |
  
  Rule: 生物的tag不可為空
    Scenario Outline: 新增/更新生物時檢查 tag
      Given 生物請求資料如下
        | name | tag   | amount | length | aquarium |
        | 小丑魚 | <tag> | 100    | 10     | 主缸       |
      When 使用者新增/更新生物
      Then 操作結果應為
        | success   | message                |
        | <success> | <message>              |

      Examples:
        | tag   | success | message            |
        | 上層魚 | true    |                     |
        |       | false   | 生物的tag不可為空   |

  Rule: 生物的金額 >= 0
    Scenario Outline: 新增/更新生物時檢查金額
      Given 生物請求資料如下
        | name | tag | amount   | length | aquarium |
        | 小丑魚 | 上層魚 | <amount> | 10     | 主缸       |
      When 使用者新增/更新生物
      Then 操作結果應為
        | success   | message                |
        | <success> | <message>              |

      Examples:
        | amount | success | message               |
        | 100    | true    |                        |
        | -100   | false   | 生物的金額必須 >= 0   |

  Rule: 所屬魚缸必須存在於系統
    Scenario Outline: 新增/更新生物時檢查所屬魚缸是否存在
      Given 系統初始魚缸資料如下
        | name   |
        | <existingAquarium> |
      And 生物請求資料如下
        | name | tag | amount | length | aquarium   |
        | 小丑魚 | 上層魚 | 100    | 10     | <aquarium> |
      When 使用者新增/更新生物
      Then 操作結果應為
        | success   | message                    |
        | <success> | <message>                  |

      Examples:
        | existingAquarium | aquarium | success | message                  |
        | 主缸              | 主缸      | true    |                           |
        |                  | 主缸      | false   | 所屬魚缸不存在於系統中    |

  Rule: 生物的長度 >= 0
    Scenario Outline: 新增/更新生物時檢查長度
      Given 生物請求資料如下
        | name | tag | amount | length   | aquarium |
        | 小丑魚 | 上層魚 | 100    | <length> | 主缸       |
      When 使用者新增/更新生物
      Then 操作結果應為
        | success   | message                |
        | <success> | <message>              |

      Examples:
        | length | success | message               |
        | 100    | true    |                        |
        | -100   | false   | 生物的長度必須 >= 0   |

  Rule: 更新生物必須存在於系統中
    Scenario Outline: 更新生物時檢查目標生物是否存在
      Given 系統初始生物資料如下
        | name             | tag   | amount | length | aquarium |
        | <existingName>   | 上層魚 | 100    | 10     | 主缸       |
      And 生物更新資料如下
        | name    | tag   | amount | length | aquarium |
        | 小丑魚   | 上層魚 | 100    | 100    | 主缸       |
      When 使用者更新名稱為「小丑魚」的生物
      Then 操作結果應為
        | success   | message      |
        | <success> | <message>    |

      Examples:
        | existingName | success | message   |
        | 小丑魚        | true    |           |
        |              | false   | 生物不存在 |

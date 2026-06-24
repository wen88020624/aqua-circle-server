Feature: 水質檢測記錄管理
  為了追蹤魚缸水質變化
  使用者可以在魚缸中新增與更新水質檢測記錄
  並且可以維護檢測種類、檢測日期、數值與所屬魚缸

  Rule: 水質檢測記錄的檢測種類不可為空
    Scenario Outline: 新增/更新水質檢測記錄時檢查檢測種類
      Given 水質檢測記錄請求資料如下
        | metric   | date       | value | aquarium |
        | <metric> | 2025-01-01 | 10    | 主缸      |
      When 使用者新增/更新水質檢測記錄
      Then 操作結果應為
        | success   | message                           |
        | <success> | <message>                         |

      Examples:
        | metric   | success | message                           |
        | NH3+NH4  | true    |                                   |
        |          | false   | 水質檢測記錄的檢測種類不可為空    |

  Rule: 水質檢測記錄的檢測日期不可為空
    Scenario Outline: 新增/更新水質檢測記錄時檢查檢測日期
      Given 水質檢測記錄請求資料如下
        | metric  | date   | value | aquarium |
        | NH3+NH4 | <date> | 10    | 主缸      |
      When 使用者新增/更新水質檢測記錄
      Then 操作結果應為
        | success   | message                           |
        | <success> | <message>                         |

      Examples:
        | date       | success | message                           |
        | 2025-01-01 | true    |                                   |
        |            | false   | 水質檢測記錄的檢測日期不可為空    |

  Rule: 水質檢測記錄的數值不可為空
    Scenario Outline: 新增/更新水質檢測記錄時檢查數值
      Given 水質檢測記錄請求資料如下
        | metric  | date       | value   | aquarium |
        | NH3+NH4 | 2025-01-01 | <value> | 主缸      |
      When 使用者新增/更新水質檢測記錄
      Then 操作結果應為
        | success   | message                       |
        | <success> | <message>                     |

      Examples:
        | value | success | message                       |
        | 10    | true    |                               |
        |       | false   | 水質檢測記錄的數值不可為空    |

  Rule: 水質檢測記錄的所屬魚缸不可為空
    Scenario Outline: 新增/更新水質檢測記錄時檢查所屬魚缸
      Given 水質檢測記錄請求資料如下
        | metric  | date       | value | aquarium   |
        | NH3+NH4 | 2025-01-01 | 10    | <aquarium> |
      When 使用者新增/更新水質檢測記錄
      Then 操作結果應為
        | success   | message                           |
        | <success> | <message>                         |

      Examples:
        | aquarium | success | message                           |
        | 主缸      | true    |                                   |
        |          | false   | 水質檢測記錄的所屬魚缸不可為空    |

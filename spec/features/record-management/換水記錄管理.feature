Feature: 換水記錄管理
  為了維持魚缸穩定水質
  使用者可以新增與更新換水記錄
  並且可以記錄日期、換水量、備註與所屬魚缸

  Rule: 換水記錄的日期不可為空
    Scenario Outline: 新增/更新換水記錄時檢查日期
      Given 換水記錄請求資料如下
        | date   | ratio | aquarium | notes |
        | <date> | 0.5   | 主缸      | 定期換水 |
      When 使用者新增/更新換水記錄
      Then 操作結果應為
        | success   | message                  |
        | <success> | <message>                |

      Examples:
        | date       | success | message                  |
        | 2025-01-01 | true    |                          |
        |            | false   | 換水記錄的日期不可為空   |

  Rule: 換水記錄的換水量不可為空
    Scenario Outline: 新增/更新換水記錄時檢查換水量
      Given 換水記錄請求資料如下
        | date       | ratio   | aquarium | notes |
        | 2025-01-01 | <ratio> | 主缸      | 定期換水 |
      When 使用者新增/更新換水記錄
      Then 操作結果應為
        | success   | message                    |
        | <success> | <message>                  |

      Examples:
        | ratio | success | message                    |
        | 0.5   | true    |                            |
        |       | false   | 換水記錄的換水量不可為空   |

  Rule: 換水記錄的所屬魚缸不可為空
    Scenario Outline: 新增/更新換水記錄時檢查所屬魚缸
      Given 換水記錄請求資料如下
        | date       | ratio | aquarium   | notes |
        | 2025-01-01 | 0.5   | <aquarium> | 定期換水 |
      When 使用者新增/更新換水記錄
      Then 操作結果應為
        | success   | message                      |
        | <success> | <message>                    |

      Examples:
        | aquarium | success | message                      |
        | 主缸      | true    |                              |
        |          | false   | 換水記錄的所屬魚缸不可為空   |

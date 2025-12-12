# 釐清問題

ERM 中的「魚隻」(Fish) 與 Feature 中的「生物」是否為同一概念？

# 定位

ERM：Fish 實體
Feature：生物管理功能

# 多選題

| 選項 | 描述 |
|--------|-------------|
| A | 是同一概念，Fish 實體對應生物管理功能 |
| B | 不同概念，Fish 僅指魚類，生物包含魚類和其他生物 |
| C | 需要將 Fish 實體改名為生物（Creature/Organism） |
| Short | 提供其他簡短答案（<=5 字） |

# 影響範圍

- Fish 實體的命名與定義
- 生物管理功能的資料模型對應
- 所有涉及生物/魚隻的功能

# 優先級

High
- High：阻礙核心功能定義或資料建模

---
# 解決記錄

- **回答**：C - 需要將 Fish 實體改名為生物（Creature/Organism）
- **更新的規格檔**：spec/erm.dbml, spec/features/魚缸管理.feature, spec/features/餵食記錄管理.feature
- **變更內容**：
  - 將 ERM 中的 Fish 實體改名為 Creature
  - 更新所有 note 中的「魚隻」為「生物」
  - 更新外鍵關係：Ref: Creature.aquarium_id > Aquarium.id
  - 更新 Feature 檔案中的「魚隻」為「生物」以保持一致性

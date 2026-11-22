# 路线图与风险考量 · Roadmap

本文件记录**尚未实现**的设想及其可行性、难度与风险。写在这里的目的是：先把边界说清楚，避免为了「功能全」而破坏 DSH 的安全语义。

## 阶段 6 设想（未实现）：把权限 / 模型 / 团队协作纳入场景

需求来源：希望一个场景同时决定「插件 + MCP + 技能 + 注明」之外，还决定会话的**权限档位**（仅可查看 / 工作区内修改 / 完全权限）、**模型与推理等级**、**启用智能体团队协作**。

### 逐项评估

| 项目 | 可行性 | 难度 | 风险与前提 |
| --- | --- | --- | --- |
| 权限档位 | 只能影响**新建会话的默认值**；已存在会话没有安全通道改写 | 中（需先定位权限默认值的存储位置） | 插件在会话中途静默提权，等于绕过用户自己的审批设置；中途降权会让正在运行的写入/命令工具当场失败。**本项目不做运行中改权限** |
| 模型 / 推理等级 | 可行：`agent-default-model` 的 `provider` / `model` / `reasoningEffort` 可经 `configEditor.edit()` 写入 profile 补丁 | 低—中 | 写的是**profile 全局默认**（影响所有工作区的新会话，不是单场景私有）；写入会热重载该 entry，可能打断正在跑的回合，必须复用「有会话运行中拒绝切换」 |
| 启用智能体团队协作 | 未定位存储位置（会话级开关，还是某个 agent/team 配置） | 未知 | 若为会话级，同样只能影响新建会话；若为全局配置，则与模型项同样的全局语义问题 |

### 如果要做，设计边界（草案）

1. 场景新增字段：`session: { permission?, model?, reasoningEffort?, team? }`，`null` 表示「该场景不管理这几项」。
2. 应用时机：只在**没有会话运行**时写入；写入对象是「新会话默认值」，绝不改当前已存在的会话。
3. 冲突提示：应用前明确列出「这会改变所有工作区新会话的默认值」，逐项确认。
4. 撤销：与插件/MCP/技能/注明一致，记录 `beforeSession` 并支持整体还原。
5. 权限项：只允许在「新建会话前」给建议或设置默认，任何「会话中途改权限」的实现都不接受。

### 为什么可能不该由本插件做

这几项（权限、模型、团队协作）本质属于 **DSH 官方的会话与 agent 层**，不是插件层。它们牵涉审批语义、安全边界与全局默认，官方最清楚约束在哪，也最可能直接提供「场景/预设」类能力。

因此本项目的立场是：

- **这可能由官方提供，而且官方实现很可能才是最优解**；
- 本插件不抢先把它做成「写全局配置的隐藏开关」，避免和官方将来的实现冲突、或让用户误以为权限切换是插件级安全操作；
- 如果 DSH 官方后续提供了等价能力，本插件会**移除对应功能并引导用户使用官方入口**，只保留插件/MCP/技能/注明这些确实属于管理层的部分。

状态：**仅记录，未实现**。若要推进，先做只读定位（权限默认值、团队协作开关的存储位置），再出可确认的计划。

---

## English summary

The next idea is to let a scene also carry the session's **permission preset**, **model + reasoning effort**, and the **agent-team toggle**. It is deliberately **not implemented**:

- Permission presets are session-scoped security settings; a plugin must never raise them mid-session (that would bypass the user's own approval settings), and lowering them mid-session breaks in-flight tools. At most a plugin may change the default used by *new* sessions.
- Model / reasoning effort is writable (`agent-default-model`), but it is a **profile-wide default**, and writing it hot-reloads the entry, so it must be gated on "no session is running".
- The agent-team toggle's storage is still unknown.

These belong to DSH's own session/agent layer. **The official implementation may well be the optimal solution**, so this plugin will not pre-empt it with hidden global-config switches; if DSH ships an equivalent feature, the corresponding part here will be removed in favour of the official entry point.

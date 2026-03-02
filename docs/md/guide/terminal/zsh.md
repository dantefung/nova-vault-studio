# zsh

## zsh vi 模式

可以通过一条命令或在 ~/.zshrc 文件中添加一行来启用 Zsh 的内置 vi 模式。这提供了类似 Vim 的按键绑定用于编辑命令行。若要获得更完整的 Vim 体验，包括高级功能和视觉模式指示符，可以使用专门的插件。 

### 启用内置 Vi 模式

要获得基本的 Vim 按键绑定，请按以下步骤操作：
打开 ~/.zshrc 文件（例如 vim ~/.zshrc）。
在文件中添加以下一行：

```
bindkey -v
```

保存文件并重启终端，或运行 `source ~/.zshrc` 将更改应用到当前会话。

默认情况下，你将以插入模式开始。按 ESC 键可切换到普通模式（命令模式）。
你也可以使用命令 `set -o vi` 为当前会话启用此功能。

### 使用插件增强功能

虽然内置模式是可用的，但它缺少一些高级 Vim 功能，如视觉模式指示符或无缝的系统剪贴板集成。插件可以提供更全面和"友好"的 Vim 体验。

**常见选项包括：**

- `zsh-vi-mode`：一个广泛使用的功能丰富的插件，提供文本对象、搜索、撤销/重做等功能。

- Oh My Zsh 的 vi-mode 插件：如果你使用 Oh My Zsh 框架，可以通过在 ~/.zshrc 文件中的 plugins 数组中添加 `vi-mode` 来启用其官方 vi-mode 插件。

- `sharat87/zsh-vim-mode`：提供"合理的绑定"使行为更一致地类似于 Vim。 

## zsh插件
### 提示（Prompt）插件

- Powerlevel10k：基于 Oh My Zsh 或原生 zsh 的高级主题，显示 Git 状态、命令时长、当前目录等信息。安装通常需要 Powerline/Nerd 字体，安装后运行 `p10k configure` 进行交互式配置。

	安装示例（使用 Oh My Zsh + git）：

	git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/themes/powerlevel10k
	将 `ZSH_THEME="powerlevel10k/powerlevel10k"` 写入 `~/.zshrc`，重新打开终端或 `source ~/.zshrc`。

- Starship：跨 shell 的轻量级提示符，配置简单，性能优异。安装并在 `~/.zshrc` 中添加 `eval "$(starship init zsh)"` 即可生效。

	安装示例（Linux/macOS）：

	curl -sS https://starship.rs/install.sh | sh
	echo 'eval "$(starship init zsh)"' >> ~/.zshrc

### 语法高亮与交互建议（Syntax Highlighting & Suggestions）

- `zsh-syntax-highlighting`：在命令行实时高亮语法错误、命令和参数，使错误更明显。通常在 `~/.zshrc` 中放在最后加载：

	source /path/to/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

- `zsh-autosuggestions`：根据历史命令实时给出建议，接受建议可使用 `→` 键或自定义按键（默认 `Ctrl+>`）。安装后在 `~/.zshrc` 中 `source` 即可启用。

- 命令/脚本静态检查：交互式终端里无法替代完整的静态分析工具，推荐在编写脚本时使用 `shellcheck` 做语法与风格检查：

	sudo apt install shellcheck
	shellcheck myscript.sh

	对于交互式提示前的即时检测，可以结合 `zsh-syntax-highlighting` 识别基本错误，或在重要脚本提交前通过 CI/钩子运行 `shellcheck`。

### z 插件（快速目录跳转）

**说明：** zsh 本身没有内置快速目录跳转功能；`z` 和 `zoxide` 是第三方工具，通过记录访问频率与最近使用情况实现智能目录跳转，并非 zsh 内置。

- **Oh My Zsh 中的 `z` 插件**：是对 `rupa/z` 脚本的封装，支持配置启用（`plugins=(... z ...)`）无需手动 source。通过历史访问频率自动匹配最相关的目录，使用 `z <fragment>` 快速跳转。
  
  使用示例：
  
  - `z proj`：跳至最常访问且匹配 `proj` 的目录
  - `z -l proj`：列出所有匹配项
  - `z -e`：编辑数据库（存储访问历史记录的文件）

- **rupa/z（独立安装）**：如不使用 Oh My Zsh，可从 https://github.com/rupa/z 克隆或下载 `z.sh`，在 `~/.zshrc` 中 source：

  . /path/to/z.sh

- **zoxide**：是 rupa/z 的现代 Rust 重写，速度更快、功能更丰富（支持更精准的模糊匹配、与 `fzf` 联动等）。两者代替关系而非同一物：

	curl -sS https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | bash
	eval "$(zoxide init zsh)"

  使用方式同样是 `z <pattern>`，可通过 `zi` 配合 `fzf` 进行交互式选择。

**选择建议：** 若使用 Oh My Zsh 且满足其 `z` 插件功能，无需额外安装；若追求更快速度与更强功能，可选择 `zoxide`。

### 示例：把这些插件加入 `~/.zshrc` 的简化模板

**使用 Oh My Zsh 时可配置插件（无需显式 source）：**

```zsh
# 在 ~/.zshrc 中的 plugins=() 里添加已安装的插件名
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
  zoxide
)

# 提示符初始化 (选择一种)
eval "$(starship init zsh)"
# 或
ZSH_THEME="powerlevel10k/powerlevel10k"
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
```

**纯 zsh（不使用 Oh My Zsh）时的显式加载方式：**

```zsh
# Prompt
eval "$(starship init zsh)"

# 目录跳转
eval "$(zoxide init zsh)"

# 手动 source 插件（如果未使用插件管理器）
source /path/to/zsh-autosuggestions/zsh-autosuggestions.zsh
source /path/to/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
```

更多插件与配置请参考各插件仓库的 README，安装方式会根据你使用的插件管理器（Oh My Zsh / zplug / antigen / zinit 等）有所不同。


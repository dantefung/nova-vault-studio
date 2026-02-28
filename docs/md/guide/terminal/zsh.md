# zsh

todo ..


## zsh vi mode

You can enable Zsh's built-in vi-mode with a single command or by adding a line to your ~/.zshrc file. This provides Vim-like key bindings for editing the command line. For a more complete Vim experience, including advanced features and visual mode indicators, dedicated plugins are available. 

### Enabling the Built-in Vi-Mode

To get basic Vim key bindings, use the following steps:
Open your ~/.zshrc file in a text editor (e.g., vim ~/.zshrc).
Add the following line to the file:

```
bindkey -v
```

Save the file and restart your terminal, or run source ~/.zshrc to apply the changes to your current session.

By default, you will start in insert mode. Press the ESC key to switch to normal mode (command mode). 
You can also enable it for the current session using the command set -o vi


### Using Plugins for Enhanced Functionality 

While the built-in mode is functional, it lacks some advanced Vim features like visual mode indicators or seamless system clipboard integration. Plugins can provide a more comprehensive and "friendly" Vim experience. 

**Popular options include:**

- zsh-vi-mode: A widely used, feature-rich plugin that offers text objects, searching, undo/redo, and more.

- Oh My Zsh's vi-mode plugin: If you are using the Oh My Zsh framework, you can enable its official -

- vi-mode plugin by adding vi-mode to the plugins array in your ~/.zshrc file.
sharat87/zsh-vim-mode: Provides "sane bindings" to make the behavior more consistently Vim-like. 

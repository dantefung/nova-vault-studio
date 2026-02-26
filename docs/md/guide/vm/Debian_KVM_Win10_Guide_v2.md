# Debian 12 / 13 安装 KVM 并部署 Windows 10 完整实战指南（增强版）

适用系统：Debian 12 / Debian 13

------------------------------------------------------------------------

# 一、安装 KVM

## 更新系统

``` bash
sudo apt update && sudo apt upgrade -y
```

## 安装组件

``` bash
# KVM
sudo apt install -y qemu-kvm qemu-system qemu-utils

# 管理
sudo apt install -y libvirt-clients libvirt-daemon-system virtinst

# 界面
sudo apt install -y virt-manager bridge-utils ovmf

# Python 绑定（用于某些脚本或 virt-manager 组件）
sudo apt install -y python3-gi gir1.2-libvirt-1.0  # 若安装过程中提示 gi 模块报错，则需要这个依赖
```

## 启动服务

``` bash
sudo systemctl enable libvirtd
sudo systemctl start libvirtd
```

检查：

``` bash
virsh list --all
```

------------------------------------------------------------------------

# 二、准备 ISO 文件

## Windows 10 ISO

建议官方版本： Win10_22H2_Chinese_Simplified_x64.iso 大小应 5GB 以上。

存放：

``` bash
sudo mkdir -p /var/lib/libvirt/iso
sudo mv Win10.iso /var/lib/libvirt/iso/win10.iso
```

## VirtIO 驱动

``` bash
cd /var/lib/libvirt/iso
sudo wget https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/archive-virtio/virtio-win-0.1.229-1/virtio-win-0.1.229.iso
```

------------------------------------------------------------------------

# 三、创建虚拟机

``` bash
sudo /usr/bin/virt-install \
  --name win10-01 \
  --memory 8192 \
  --vcpus 8,sockets=2,cores=2,threads=2 \
  --cpu host-model \
  --machine q35 \
  --boot loader=/usr/share/OVMF/OVMF_CODE_4M.fd,loader.readonly=yes,loader.type=pflash,nvram.template=/usr/share/OVMF/OVMF_VARS_4M.fd \
  --osinfo win10 \
  --disk path=/var/lib/libvirt/images/pool/win10.img,size=60,format=qcow2,bus=virtio \
  --disk path=/var/lib/libvirt/iso/virtio-win-0.1.229.iso,device=cdrom \
  --cdrom /var/lib/libvirt/iso/win10.iso \
  --network network=default,model=virtio \
  --graphics spice \
  --input type=tablet,bus=usb \
  --autostart

```

### 参数说明

下表解释了 `virt-install` 命令中各个参数的含义：

| 参数 | 含义 |
|------|------|
| `--name win10-01` | 虚拟机名称，用于管理和识别。 |
| `--memory 8192` | 分配给虚拟机的 RAM 大小，单位为 MB。 |
| `--vcpus 8,sockets=2,cores=2,threads=2` | 指定虚拟 CPU 配置：总 vCPU 数为 8，2 个插槽，每个插槽 2 个内核，每个内核 2 个线程。 |
| `--cpu host-model` | 使用与宿主机相同的 CPU 模型，以获得最佳性能。 |
| `--machine q35` | 指定机器类型为 q35（支持 UEFI/OVMF 等现代功能）。 |
| `--boot loader=...,loader.readonly=yes,loader.type=pflash,nvram.template=...` | 设置启动加载程序和 UEFI 固件路径，`loader.readonly` 表示固件只读，`nvram.template` 指定初始 NVRAM 模板。 |
| `--osinfo win10` | 提供操作系统信息，简化安装过程。 |
| `--disk path=...,size=60,format=qcow2,bus=virtio` | 定义第一个磁盘映像位置、大小、格式及总线类型（virtio 提供更好性能）。`virt-install` 会在指定路径自动创建该映像文件；通常只需保证目录存在且可写，无需手动预先创建。 |
| `--disk path=...,device=cdrom` | 将 VirtIO 驱动 ISO 作为光盘插入，以便在安装过程中加载驱动。 |
| `--cdrom /var/lib/libvirt/iso/win10.iso` | 指定 Windows 安装 ISO 文件路径作为安装媒体。 |
| `--network network=default,model=virtio` | 使用默认 NAT 网络并将网卡类型设置为 virtio。 |
| `--graphics spice` | 使用 SPICE 协议提供图形访问，适用于 Windows 客户机。 |
| `--input type=tablet,bus=usb` | 添加一个平板输入设备，以改进鼠标同步。 |
| `--autostart` | 设置虚拟机开机自启。 |

这部分帮助理解各项参数的含义，可根据需求调整配置。


------------------------------------------------------------------------

# 四、安装时加载磁盘驱动

安装界面若无磁盘：

加载驱动 → 选择：

viostor`\w10`{=tex}`\amd64`{=tex}

------------------------------------------------------------------------

# 五、安装后无网络

打开 VirtIO 光盘，运行：

virtio-win-guest-tools.exe

自动安装所有驱动。

------------------------------------------------------------------------

# 六、磁盘扩容

## 关机

``` bash
virsh shutdown win10-01
```

## 扩容到 120G

``` bash
sudo qemu-img resize /var/lib/libvirt/images/win10.img 120G
```

## Windows 内扩展分区

磁盘管理 → 扩展卷

------------------------------------------------------------------------

# 七、常见问题

## gi 模块报错

``` bash
sudo apt install python3-gi gir1.2-libvirt-1.0
```

## 进入 UEFI Shell

    fs0:
    cd EFI
    cd BOOT
    BOOTX64.EFI

------------------------------------------------------------------------

# 八、推荐配置

  项目       推荐
  ---------- -------------
  固件       UEFI (OVMF)
  磁盘       virtio
  网卡       virtio
  机器类型   q35
  CPU        host-model

------------------------------------------------------------------------

# 完成

你已成功掌握 Debian 下部署 Win10 KVM 全流程。

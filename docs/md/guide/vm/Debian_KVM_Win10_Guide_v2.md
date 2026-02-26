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
sudo apt install -y qemu-kvm libvirt-daemon-system libvirt-clients virtinst virt-manager bridge-utils ovmf python3-gi gir1.2-libvirt-1.0
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

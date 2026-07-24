# cloudflare-certbot-dns-hook

方便的对运行在cloudflare上的域名进行certbot-dns挑战.

## 安装

```
npm i -g @lsby/cloudflare-certbot-dns-hook
```

## 使用

首先，请确保你要申请证书的主域名（例如 `aaa.com`）已经在你 Cloudflare 账号的域名列表中。脚本会在运行中自动添加和清理所需的 DNS TXT 验证记录，无需你手动进行任何解析配置。

接下来安装 certbot。

接下来创建两个文件, windows和linux略有不同.

- 文件后缀名不同, windows是`.cmd`或`.bat`, linux是`.sh`.
- 设置环境变量的写法不同, windows是`set`, linux是`export`.

下面的示例使用windows的写法:

auth.cmd:

```
set CLOUDFLARE_API_TOKEN=<cloudflare的token>
set CLOUDFLARE_ZONE_ID=<cloudflare域名的区域id>

lsby-cloudflare-certbot-dns-hook-auth
```

cleanup.cmd:

```
set CLOUDFLARE_API_TOKEN=<cloudflare的token>
set CLOUDFLARE_ZONE_ID=<cloudflare域名的区域id>

lsby-cloudflare-certbot-dns-hook-cleanup
```

最后执行命令:

根据你需要申请的证书类型，通过 `-d` 参数指定域名：

**选项 1：申请单域名证书**（例如只为 `bbb.aaa.com` 申请）

```
certbot certonly --manual --non-interactive --preferred-challenges=dns --manual-auth-hook <auth文件路径> --manual-cleanup-hook <cleanup文件路径> --agree-tos -m <邮箱> -d bbb.aaa.com
```

**选项 2：申请泛域名证书**（例如为 `*.aaa.com` 申请，可匹配该域名下所有子域）

```
certbot certonly --manual --non-interactive --preferred-challenges=dns --manual-auth-hook <auth文件路径> --manual-cleanup-hook <cleanup文件路径> --agree-tos -m <邮箱> -d "*.aaa.com" -d aaa.com
```

> **注意**:
>
> 1. 申请泛域名证书时，请务必像上方示例一样**使用双引号包裹泛域名**，以防止星号被命令行（如 shell）当作通配符错误解析。
> 2. `*.aaa.com` 不包含 `aaa.com`，所以推荐像上方示例一样使用 `-d "*.aaa.com" -d aaa.com`。

- 执行后会卡住很久, 是正常的, 因为要等待dns传播. 现在设置的是等待一分钟.
- 续期时重新执行以上命令即可.

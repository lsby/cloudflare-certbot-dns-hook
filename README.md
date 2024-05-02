# cloudflare-certbot-dns-hook

方便的对运行在cloudflare上的域名进行certbot-dns挑战.

## 安装

```
npm i -g @lsby/cloudflare-certbot-dns-hook
```

## 使用

先安装certbot.

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

```
certbot certonly --manual --non-interactive --preferred-challenges=dns --manual-auth-hook <auth文件路径> --manual-cleanup-hook <cleanup文件路径> --agree-tos -m <邮箱> -d <完整子域名>
```

- 执行后会卡住很久, 是正常的, 因为要等待dns传播. 现在设置的是等待一分钟.
- 续期时重新执行以上命令即可.

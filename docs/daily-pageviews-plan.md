# 今日浏览量实施与部署计划

状态：计划，尚未实现统计服务或执行部署。下面的部署命令须在对应文件完成并测试通过后执行。

## 1. 目标与统计口径

- 全站正常页面底部显示小字“今日浏览 N 次”，不恢复首页统计栏。
- PV 按页面加载统计：打开文章、刷新均加一；搜索输入、主题切换不加一。
- 仅生产站点 jxkwiki.cn 上报，本地开发、预览、404 页面不计数。
- 日期由服务端按 Asia/Shanghai 计算；按日期保存，不在零点删除旧数据。
- 数字从启用统计时开始累计，不补造过去的访问量。
- 页面显示该次请求返回的全站当日数量，不轮询；停留页面跨日后可读取新日期的数量，但不额外计数。
- 不统计 UV，不保存 IP、Cookie 或个人浏览历史到统计数据库。Caddy 原有访问日志单独管理。
- JS 被禁用、请求被拦截时可能漏计；脚本刷量仍可能发生，因此不作为严格审计数据。

## 2. 技术方案

Astro 保持静态构建。增加 Python + Flask + Gunicorn 小服务，由 systemd 管理。
Python sqlite3 保存数据，无需安装独立数据库或在服务器运行 Astro。
服务仅监听 127.0.0.1:8787；Caddy 转发同域 /api/visits，安全组无需新增端口。

数据库在 /var/lib/tech-notes-stats/visits.sqlite3，与 /var/www/tech-notes 静态发布目录分开，避免发布覆盖。

接口约定：

| 接口 | 功能 |
| --- | --- |
| GET /healthz | 健康检查，不计数 |
| GET /api/visits | 读取北京时间当天 PV，不计数 |
| POST /api/visits | 记录一次浏览，返回当天日期与总量 |

响应结构：`{"date":"YYYY-MM-DD","pageviews":整数}`，设置 Cache-Control: no-store。
写入使用事务与原子 UPSERT，配置 busy timeout；每个请求使用独立连接。
POST 校验允许的 Origin、限制请求体大小，并接收页面加载级 requestId；同一 requestId 重试不重复计数。
Origin 校验只能阻止部分跨站请求，不能防止伪造请求。第一版不按 IP 去重，以免把 PV 变成访客计数。

## 3. 项目实施清单

1. 新增 services/visits/app.py、锁定版本的 requirements.txt 和接口测试。
2. 新增 deploy/tech-notes-stats.service：非 root 服务账号、WorkingDirectory=/opt/tech-notes-stats、StateDirectory=tech-notes-stats、Restart=on-failure。
3. 服务环境配置数据库路径、Asia/Shanghai 与允许的生产 Origin。
4. Gunicorn 初始使用 1 个 worker、适量线程，只绑定回环地址；实测内存后再调整。
5. 新增 src/components/DailyPageviews.astro；接入 BaseLayout，并为 404 增加禁用开关。
6. 生产构建及生产 hostname 双重限制；每次页面加载只上报一次。异常时隐藏，不显示假零。
7. 新增部署文档与 Caddy 配置片段；不把真实密钥或数据库提交 Git。

## 4. 本地验收

由开发者完成以下检查后再部署：

- npm run check、npm run build。
- 后端测试：首次访问、连续访问、并发累加、重复 requestId、不合法 Origin、北京时间跨日、重启持久化。
- 前端：本地不上报；生产页面仅一次上报；404 不上报；故障隐藏；浅色、深色、手机排版。
- 失败重试复用 requestId，不能因网络超时重复累加。
- 输出可上传的服务目录及 systemd 文件。以下操作依赖这一步的产物。

## 5. 你的操作：服务器部署

先部署后端，再发布含统计组件的前端。通过 SSH 登录 ECS。以下假设 Ubuntu + systemd，当前静态站由 Caddy 提供；先核实实际路径与配置。

### 5.1 准备 Python 和账号（服务器执行）

```bash
sudo apt update
sudo apt install -y python3-venv
id tech-notes-stats || sudo useradd --system --no-create-home --shell /usr/sbin/nologin tech-notes-stats
sudo install -d -m 755 /opt/tech-notes-stats
sudo install -d -o tech-notes-stats -g tech-notes-stats -m 750 /var/lib/tech-notes-stats
```

将完成实现后的 services/visits/ 内容通过 SFTP 上传至登录用户的 ~/tech-notes-stats-upload/，将 deploy/tech-notes-stats.service 上传到同一临时目录。
只上传代码、依赖文件和服务配置，不上传本地数据库、虚拟环境或 node_modules。

### 5.2 安装服务（服务器执行）

```bash
sudo install -m 644 ~/tech-notes-stats-upload/app.py /opt/tech-notes-stats/app.py
sudo install -m 644 ~/tech-notes-stats-upload/requirements.txt /opt/tech-notes-stats/requirements.txt
sudo python3 -m venv /opt/tech-notes-stats/.venv
sudo /opt/tech-notes-stats/.venv/bin/pip install -r /opt/tech-notes-stats/requirements.txt
sudo install -m 644 ~/tech-notes-stats-upload/tech-notes-stats.service /etc/systemd/system/tech-notes-stats.service
sudo systemctl daemon-reload
sudo systemctl enable --now tech-notes-stats
sudo systemctl status tech-notes-stats --no-pager
curl -fsS http://127.0.0.1:8787/healthz
curl -fsS http://127.0.0.1:8787/api/visits
```

如果服务失败，先执行 `sudo journalctl -u tech-notes-stats -n 80 --no-pager` 排查，不继续修改 Caddy。

### 5.3 接入 Caddy

先备份实际 Caddyfile，例如：

```bash
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.before-visits
sudo nano /etc/caddy/Caddyfile
```

在现有 jxkwiki.cn 站点块内增加：

```caddyfile
handle /api/visits {
    reverse_proxy 127.0.0.1:8787
}
```

现有静态文件处理应放入无匹配条件的 `handle { ... }` 作为回退，与 API 路由互斥。保留原 root、file_server、压缩、404 处理和 www 跳转；不要用片段覆盖整个 Caddyfile。
使用 handle 而不是 handle_path，避免去掉后端需要的路径。不要把 /healthz 公开代理。
如已有复杂 rewrite/route，先检查完整配置再合并。

```bash
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
# 只有 validate 成功才执行：
sudo systemctl reload caddy
curl -fsS https://jxkwiki.cn/api/visits
```

GET 只读取，反复执行不会增加浏览量。若返回 HTML，则 API 请求被静态站路由处理，需检查 Caddy 配置。

### 5.4 发布前端

在 Windows 项目目录执行本地检查，提交实现后按现有静态站发布流程部署 dist。先确认服务器 API 可用，再上线组件。

```powershell
npm run check
npm run build
# 确认 git diff、待提交文件后提交，并推送触发现有发布流程（如已配置）。
git status --short
```

当前仓库中未发现 GitHub Actions 配置，不能假定 git push 一定会部署；沿用实际使用的上传流程，并检查线上更新。

## 6. 上线验收与维护

1. 读取 GET /api/visits，记录当前数字。
2. 浏览器打开生产首页，确认底部显示当天 PV，开发者工具只有一次 POST。
3. 打开文章或刷新，通常增加一；并发有其他访客时可能增加更多。
4. 输入标题搜索、切换主题，确认不新增 POST。
5. GET 接口不累加；404 不上报。
6. 重启统计服务后旧数据仍在；跨日行为先用测试时钟验证，不修改服务器系统时间。
7. 统计服务停机时网页仍可阅读，数字隐藏；恢复服务后新加载页面恢复显示。

备份使用 SQLite backup API 导出一致性快照，备份放在静态目录之外；若开启 WAL，不在运行中仅复制主数据库文件。
发布服务只更新 /opt 下的代码，不覆盖 /var/lib 中的数据库。

回滚：移除前端统计组件并重新发布，恢复 Caddy 原配置并 validate/reload，再停止统计服务。保留数据库供以后恢复。

## 7. 参考

- https://caddyserver.com/docs/caddyfile/directives/handle
- https://caddyserver.com/docs/caddyfile/directives/reverse_proxy
- https://docs.python.org/3/library/sqlite3.html

下一步：先实现第 3 节并完成第 4 节测试；当前不能直接执行第 5 节安装服务，因为服务文件尚未生成。

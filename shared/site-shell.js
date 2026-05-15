(function siteShellBootstrap() {
  if (document.getElementById("zhsl-site-shell")) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get("preview") === "1" || params.get("shell") === "0") {
    return;
  }

  const currentPath = window.location.pathname.replace(/\\/g, "/");
  const activeKey = currentPath.includes("/elder/")
    ? "elder"
    : currentPath.includes("/system/")
    ? "system"
    : currentPath.includes("/records/ngimu")
      ? "ngimu"
    : currentPath.includes("/records/realtime")
      ? "records-live"
      : currentPath.includes("/records/")
        ? "records"
        : "home";

  const basePath = activeKey === "home" ? "./" : "../";
  const links = [
    { key: "home", label: "返回首页", href: `${basePath}index.html` },
    { key: "elder", label: "长者版", href: `${basePath}elder/` },
    { key: "system", label: "系统端", href: `${basePath}system/` },
    { key: "records", label: "模型预测页", href: `${basePath}records/` },
    {
      key: "records-live",
      label: "实时监测页",
      href: `${basePath}records/realtime.html`,
    },
    {
      key: "ngimu",
      label: "硬件接入页",
      href: `${basePath}records/ngimu.html`,
    },
  ];

  const style = document.createElement("style");
  style.textContent = `
        #zhsl-site-shell {
            position: fixed;
            right: 18px;
            bottom: 18px;
            z-index: 2147483640;
            font-family: "Microsoft YaHei", "PingFang SC", system-ui, sans-serif;
        }
        #zhsl-site-shell[data-compact="true"] {
            bottom: 112px;
        }
        .zhsl-shell-toggle {
            width: 58px;
            height: 58px;
            border: 1px solid rgba(125, 211, 252, 0.28);
            border-radius: 18px;
            background: linear-gradient(135deg, rgba(15, 38, 63, 0.96), rgba(9, 18, 32, 0.96));
            color: #dff6ff;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 16px 40px rgba(2, 12, 23, 0.34);
            backdrop-filter: blur(14px);
        }
        .zhsl-shell-toggle:focus-visible {
            outline: 3px solid rgba(125, 211, 252, 0.42);
            outline-offset: 3px;
        }
        .zhsl-shell-panel {
            position: absolute;
            right: 0;
            bottom: 72px;
            width: 240px;
            padding: 14px;
            border: 1px solid rgba(125, 211, 252, 0.2);
            border-radius: 20px;
            background: rgba(8, 18, 32, 0.96);
            box-shadow: 0 24px 64px rgba(2, 8, 16, 0.42);
            backdrop-filter: blur(18px);
            opacity: 0;
            transform: translateY(8px);
            pointer-events: none;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .zhsl-shell-panel[data-open="true"] {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
        .zhsl-shell-title {
            margin: 0 0 10px;
            color: #7dd3fc;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
        }
        .zhsl-shell-list {
            display: grid;
            gap: 8px;
        }
        .zhsl-shell-link {
            display: block;
            padding: 12px 14px;
            border-radius: 14px;
            color: #e2ecff;
            text-decoration: none;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid transparent;
            transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .zhsl-shell-link:hover {
            transform: translateY(-1px);
            background: rgba(125, 211, 252, 0.08);
            border-color: rgba(125, 211, 252, 0.22);
        }
        .zhsl-shell-link[data-active="true"] {
            background: linear-gradient(135deg, rgba(52, 211, 153, 0.12), rgba(96, 165, 250, 0.14));
            border-color: rgba(110, 231, 183, 0.28);
        }
    `;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = "zhsl-site-shell";
  root.dataset.compact = String(activeKey === "elder");

  const toggle = document.createElement("button");
  toggle.className = "zhsl-shell-toggle";
  toggle.type = "button";
  toggle.textContent = "导航";
  toggle.setAttribute("aria-label", "打开全站导航");
  toggle.setAttribute("aria-expanded", "false");

  const panel = document.createElement("div");
  panel.className = "zhsl-shell-panel";
  panel.dataset.open = "false";
  panel.setAttribute("role", "navigation");
  panel.setAttribute("aria-label", "全站导航");

  const title = document.createElement("p");
  title.className = "zhsl-shell-title";
  title.textContent = "智守银龄";
  panel.appendChild(title);

  const list = document.createElement("div");
  list.className = "zhsl-shell-list";
  links.forEach((link) => {
    const anchor = document.createElement("a");
    anchor.className = "zhsl-shell-link";
    anchor.href = link.href;
    anchor.textContent = link.label;
    anchor.dataset.active = String(link.key === activeKey);
    anchor.addEventListener("click", () => {
      panel.dataset.open = "false";
      toggle.setAttribute("aria-expanded", "false");
    });
    list.appendChild(anchor);
  });
  panel.appendChild(list);

  root.appendChild(panel);
  root.appendChild(toggle);
  document.body.appendChild(root);

  const closePanel = () => {
    panel.dataset.open = "false";
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = panel.dataset.open !== "true";
    panel.dataset.open = String(open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  panel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", closePanel);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel();
    }
  });
})();

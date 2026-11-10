(function () {
  const cfg = window.SITE_CONFIG || {};
  const dashboards = cfg.dashboards || [];

  const titleEl = document.getElementById("site-title");
  const subtitleEl = document.getElementById("site-subtitle");
  const tabsEl = document.getElementById("tabs");
  const container = document.getElementById("viz-container");
  const messageEl = document.getElementById("message");

  document.title = cfg.title || "Dashboard";
  titleEl.textContent = cfg.title || "Dashboard";
  subtitleEl.textContent = cfg.subtitle || "";

  function showMessage(html) {
    container.hidden = true;
    messageEl.hidden = false;
    messageEl.innerHTML = html;
  }

  if (!dashboards.length || dashboards.some((d) => !d.url || d.url.includes("REPLACE_WITH"))) {
    showMessage(
      "<h2>Almost there</h2><p>Open <code>config.js</code> and paste your Tableau dashboard's share link into <code>url</code>.</p>"
    );
    return;
  }

  // Load the Tableau Embedding API v3 from the same host as the dashboard
  // (public.tableau.com, Tableau Cloud, or your own Tableau Server).
  const origin = new URL(dashboards[0].url).origin;
  const script = document.createElement("script");
  script.type = "module";
  script.src = origin + "/javascripts/api/tableau.embedding.3.latest.min.js";
  script.onerror = () =>
    showMessage("<h2>Couldn't load Tableau</h2><p>The Tableau Embedding API failed to load from " + origin + ".</p>");
  document.head.appendChild(script);

  // Tableau Cloud/Server dashboards need a token so viewers aren't asked to sign in.
  // The token comes from api/tableau-token.js. Tableau Public needs no token.
  async function getToken() {
    if (origin === "https://public.tableau.com") return null;
    try {
      const res = await fetch("/api/tableau-token", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.token) {
        console.warn("Tableau token not available:", data.error || res.status);
        return null;
      }
      return data.token;
    } catch (err) {
      console.warn("Tableau token request failed:", err);
      return null;
    }
  }

  let renderCount = 0;

  async function render(index) {
    const d = dashboards[index];
    const thisRender = ++renderCount;

    [...tabsEl.children].forEach((btn, i) => btn.setAttribute("aria-current", i === index ? "page" : "false"));
    history.replaceState(null, "", "#" + encodeURIComponent(d.name));

    // Each token works once, so fetch a fresh one every time a dashboard is shown.
    const token = await getToken();
    if (thisRender !== renderCount) return; // a newer tab click took over

    container.innerHTML = "";
    const viz = document.createElement("tableau-viz");
    viz.setAttribute("src", d.url);
    viz.setAttribute("width", d.width ? d.width + "px" : "100%");
    viz.setAttribute("height", d.height ? d.height + "px" : "100%");
    viz.setAttribute("toolbar", cfg.toolbar || "bottom");
    if (cfg.hideTabs !== false) viz.setAttribute("hide-tabs", "");
    if (token) viz.setAttribute("token", token);
    container.appendChild(viz);
  }

  if (dashboards.length > 1) {
    dashboards.forEach((d, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = d.name;
      btn.addEventListener("click", () => render(i));
      tabsEl.appendChild(btn);
    });
  }

  const fromHash = dashboards.findIndex((d) => "#" + encodeURIComponent(d.name) === location.hash);
  render(fromHash >= 0 ? fromHash : 0);
})();

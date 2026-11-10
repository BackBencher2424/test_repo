// Edit this file to point the site at your Tableau dashboard(s).
//
// How to get the URL:
//   Tableau Public: open the viz, click Share, and copy the link
//     e.g. https://public.tableau.com/views/MyWorkbook/MyDashboard
//   Tableau Cloud/Server: open the view, click Share, and copy the link
//     e.g. https://prod-useast-a.online.tableau.com/t/mysite/views/MyWorkbook/MyDashboard
//
// Add more entries to `dashboards` and the site shows a tab for each one.

window.SITE_CONFIG = {
  title: "Test Dashboard",
  subtitle: "Interactive Tableau analytics",

  dashboards: [
    {
      name: "Dashboard 1",
      url: "https://us-east-1.online.tableau.com/t/msbafall2026/views/TestDashboard/Dashboard1",
      // Optional: the dashboard's fixed size in pixels (leave out to fill the page)
      width: 1728,
      height: 954,
    },
  ],

  // Where the Tableau toolbar sits: "top", "bottom", or "hidden"
  toolbar: "bottom",
  // Hide the workbook's own sheet tabs inside the viz
  hideTabs: true,
};

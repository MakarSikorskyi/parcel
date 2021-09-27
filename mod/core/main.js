require.once (
    "lib/core/AJAX.js", "lib/dom/_batch.js", "lib/dom/addText.js", "lib/dom/empty.js", "lib/ui/calendar.js", "lib/dom/getFormData.js", "lib/dom/mkNode.js", "lib/event/getEvent.js",
    "lib/style/applyStyle.js", "sys/AJAX.events.js", "sys/GV.js", "ui/UI.report.js", "ui/UI.WorkSpace.js", "ui/UI.MainMenu.js"
);

window.UI.WorkSpace.add (sapi ("URL_MOD") + "core/main.php", "main");
window.UI.WorkSpace.active ("main");

var fel;
window.UI.WorkSpace.current ().empty ().$ (["appendChild",
]);

window.UI.WorkSpace.legend ("Головна сторінка");
window.UI.WorkSpace.show (true);

window.$sapi || require.once(
    "lib/dom/_batch.js", "lib/dom/addText.js", "lib/dom/classname.js", "lib/dom/empty.js", "lib/dom/mkNode.js", "lib/style/applyStyle.js", "lib/etc/helper.js", "ui/mkIco.js", 
    "ui/UI.DialogBox.js", "ui/UI.MainMenu.js", "ui/UI.WorkSpace.js", "lib/dom/getFormData.js", "lib/ui/pages.js", "lib/ui/calendar.js", "ui/UI.WSTabs.js", "lib/string/toDate.js"
) && (window.$sapi = function (/**/) {
    var ar = [];
    for (var i = 0; i < arguments.length; i++) ar[arguments[i]] = sapi ("data", arguments[i]);
    return ar;
});

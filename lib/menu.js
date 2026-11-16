
export function getSectionCommands(section, commands = []) {
  const visible = commands.filter(command => !command.hidden);
  if (Array.isArray(section.commandNames)) {
    const selected = new Set(section.commandNames.map(value => String(value).toLowerCase()));
    return visible.filter(command => selected.has(String(command.name).toLowerCase()));
  }
  const categories = Array.isArray(section.categories) && section.categories.length
    ? section.categories
    : [section.key];
  const excluded = new Set(section.excludeNames || []);
  return visible.filter(command =>
    categories.includes(command.category) && !excluded.has(command.name)
  );
}

export function buildMenu({ commands = [], config = {}, theme = {} } = {}) {
  const menu = theme.menu || {};
  const sections = Array.isArray(theme.sections) ? theme.sections : [];
  const prefix = String(config.prefix || ".");
  const safeName = String(config.name || "FEI XMD").replace(/[\r\n]/g, " ").slice(0, 40);
  const lines = [
    String(menu.top || "╭━━━「 ") + safeName + String(menu.titleEnd || " 」━━━◆"),
    String(menu.infoLine || "┃ ✧ ") + "𝑽𝒆𝒓𝒔𝒊𝒐𝒏: " + String(config.version || "1.0.0"),
    String(menu.infoLine || "┃ ✧ ") + "𝑷𝒓𝒆𝒇𝒊𝒙: " + prefix,
    String(menu.infoLine || "┃ ✧ ") + "𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝑳𝒐𝒂𝒅𝒆𝒅: " + commands.filter(command => !command.hidden).length,
    String(menu.blankLine || "┃")
  ];

  if (!commands.length) {
    lines.push(String(menu.infoLine || "┃ ✧ ") + "𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝒎𝒐𝒅𝒖𝒍𝒆𝒔 𝒂𝒓𝒆 𝒃𝒆𝒊𝒏𝒈 𝒑𝒓𝒆𝒑𝒂𝒓𝒆𝒅...");
  } else {
    const assigned = new Set();
    for (const section of sections) {
      const members = getSectionCommands(section, commands)
        .filter(command => !assigned.has(command.name));
      lines.push(String(menu.top || "╭━━━「 ") + String(section.title || section.key) +
        String(menu.titleEnd || " 」━━━◆"));
      if (!members.length) {
        lines.push(String(menu.itemLine || "┃ ⫸ ❖ ") + "(𝑵𝒐 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒚𝒆𝒕)");
      } else {
        for (const command of members) {
          assigned.add(command.name);
          lines.push(
            String(menu.itemLine || "┃ ⫸ ❖ ") + prefix + command.name +
            (command.description ? " — " + command.description : "")
          );
        }
      }
      lines.push(String(menu.bottom || "╰━━━━━━━━━━━━━━◆"), "");
    }

    const ungrouped = commands.filter(command => !command.hidden && !assigned.has(command.name));
    if (ungrouped.length) {
      lines.push("◆ 𝑶𝑻𝑯𝑬𝑹 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺");
      for (const command of ungrouped) {
        lines.push(String(menu.itemLine || "┃ ⫸ ❖ ") + prefix + command.name);
      }
    }
  }

  lines.push("⚡ 𝑷𝑶𝑾𝑬𝑹𝑬𝑫 𝑩𝒀 𝑩𝑬𝑵𝑭𝑬𝑰 𝑻𝑬𝑪𝑯");
  return lines.join("\n");
}

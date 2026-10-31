export const manifest = {
  screens: {
    scr_5b2ljf: { name: "Hero", route: "/#top", position: { "x": 160, "y": 220 } },
    scr_r9kk26: { name: "Hero — Light mode", route: "/#top", state: { "theme": "light" }, position: { "x": 1560, "y": 220 } },
    scr_ykh7bj: { name: "Selected Work", route: "/#work", position: { "x": 160, "y": 2200 } },
    scr_czgp1r: { name: "Project Preview", route: "/#work", state: { "openIndex": 0 }, position: { "x": 1560, "y": 2200 } },
    scr_4p1sx2: { name: "Showreel", route: "/#showreel", position: { "x": 160, "y": 4180 } },
    scr_5l6bcw: { name: "About", route: "/#about", position: { "x": 160, "y": 6160 } },
    scr_hqff3t: { name: "Experience", route: "/#experience", position: { "x": 1560, "y": 6160 } },
    scr_pixn3h: { name: "Craft", route: "/#craft", position: { "x": 2960, "y": 6160 } },
    scr_cqsy6c: { name: "Education & Training", route: "/#education", position: { "x": 4360, "y": 6160 } },
    scr_pv0msv: { name: "Volunteering", route: "/#volunteering", position: { "x": 5760, "y": 6160 } },
    scr_vqgl75: { name: "Contact", route: "/#contact", position: { "x": 160, "y": 8140 } }
  },
  sections: {
    sec_d0m258: { name: "Hero", x: 0, y: 0, width: 2920, height: 1180 },
    sec_eea1w2: { name: "Work", x: 0, y: 1980, width: 2920, height: 1180 },
    sec_xojhzw: { name: "Showreel", x: 0, y: 3960, width: 1520, height: 1180 },
    sec_f4gbtf: { name: "About & Background", x: 0, y: 5940, width: 7120, height: 1180 },
    sec_2ogj4r: { name: "Contact", x: 0, y: 7920, width: 1520, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_d0m258", children: [
    { kind: "screen", id: "scr_5b2ljf" },
    { kind: "screen", id: "scr_r9kk26" }]
  },
  { kind: "section", id: "sec_eea1w2", children: [
    { kind: "screen", id: "scr_ykh7bj" },
    { kind: "screen", id: "scr_czgp1r" }]
  },
  { kind: "section", id: "sec_xojhzw", children: [
    { kind: "screen", id: "scr_4p1sx2" }]
  },
  { kind: "section", id: "sec_f4gbtf", children: [
    { kind: "screen", id: "scr_5l6bcw" },
    { kind: "screen", id: "scr_hqff3t" },
    { kind: "screen", id: "scr_pixn3h" },
    { kind: "screen", id: "scr_cqsy6c" },
    { kind: "screen", id: "scr_pv0msv" }]
  },
  { kind: "section", id: "sec_2ogj4r", children: [
    { kind: "screen", id: "scr_vqgl75" }]
  }]

};
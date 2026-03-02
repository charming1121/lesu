import fs from 'fs';
const path = 'src/components/IndustryRadar.jsx';
let s = fs.readFileSync(path, 'utf8');

const alt = '\u201c看占比\u201d升级为\u201c看效能\u201d：看发了有没有人看（流量）& 性价比高不高（ROI）。';
const newText = '宏观看声量占有率（SOV），微观看竞品在各渠道的战术形式与流量热度。';
const found = s.indexOf(alt);
if (found !== -1) {
  s = s.slice(0, found) + newText + s.slice(found + alt.length);
  fs.writeFileSync(path, s);
  console.log('replaced description');
} else {
  console.log('alt not found, trying straight quotes');
  const straight = '"看占比"升级为"看效能"：看发了有没有人看（流量）& 性价比高不高（ROI）。';
  const i = s.indexOf(straight);
  if (i !== -1) {
    s = s.slice(0, i) + newText + s.slice(i + straight.length);
    fs.writeFileSync(path, s);
    console.log('replaced with straight');
  }
}

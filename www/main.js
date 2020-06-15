const sleep = ms => new Promise(res => setTimeout(res, ms));
let lines = [], currentLine = 0, last, paused = false;

const speedText = async (filePath, rowLength = 5, fontSize = 40, speed = 33) => {
  last = Math.random();
  let remLast = last;
  let text = filePath === "*" || await (await fetch(filePath, { mode: 'cors' })).text();
  lines = filePath === "*" ? lines.slice(currentLine) : text.split('\n');

  let lines2 = [''];
  let co = 0;
  // Re-divide lines based on rowLength
  for (let line of lines) {
    let words = line.trim().split(' ');
    let newLine = lines2.pop().split(' ');
    while (words.length) {
      while (newLine.length < rowLength) {
        newLine.push(words.shift());
      }
      let fineLine = new String(newLine.join(' ').trim());
      fineLine.orgLine = co;
      lines2.push(fineLine);
      newLine = [];
    }
    co++;
  }
  // Display lines
  while (lines2.length) {
    while (paused) { await sleep(100); }
    if (last !== remLast) { break; }
    let line = lines2.shift();
    currentLine = line.orgLine;
    document.querySelector('.line').innerHTML =
      `<div style="padding-top:100px;text-align:center;font-size:${fontSize}px;">${line}</div>`;
    await sleep(line.length * speed);
  }
}

const form = () => `
  <form style="padding-top:80px; text-align:center">
    Line length (words) <input value="5" type="range" min="1" max="11" name="linelength">
    <span class="linelength">05</span><br>
    Fontsize &nbsp;(in pixels) <input value="40" type="range" min="12" max="50" name="fontsize">
    <span class="fontsize">40</span><br>
    Speed (ms per char) <input value="33" type="range" min="10" max="60" name="speed">
    <span class="speed">33</span><br>
    <button type="button" style="margin-top:10px">Play/pause</button>
  </form>
`

const elisten = e => {
  document.querySelector('.' + e.target.name).innerHTML = e.target.value;
}
const elisten2 = e => {
  let f = document.forms[0].elements;
  speedText('*', +f.linelength.value, +f.fontsize.value, +f.speed.value);
}
const elisten3 = e => {
  if (!e.target.closest('button')) { return; }
  paused = !paused;
}


// Test
let div = document.createElement('div');
div.classList.add('line');
document.body.append(div);
div = document.createElement('div');
div.innerHTML = form();
document.body.append(div);
document.forms[0].addEventListener('input', elisten);
document.forms[0].addEventListener('change', elisten2);
document.forms[0].addEventListener('click', elisten3);
speedText('/pride-and-prejustice.txt');
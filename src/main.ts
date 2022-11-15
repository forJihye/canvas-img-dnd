import './style.css'
import addDragControl from './drag-control';
import addTouchControl from './touch-control';
import { loadImage } from './utils';

const app = document.getElementById('app') as HTMLDivElement;
const assets = {
  photo3: "https://media.hashsn.app/uploaded-posts/de575236-7361-45a0-8065-1b2c2906dda8.jpg",
  photo4: "https://media.hashsn.app/uploaded-posts/fb740d1c-4238-4d2d-9f8a-90094fd76ddc.jpg",
  frame1: "https://hashsnap-static.s3.ap-northeast-2.amazonaws.com/kiosk-editor/221111_lgxb/template/lgxb_frame1_1668125330187.png",
  frame2: "https://hashsnap-static.s3.ap-northeast-2.amazonaws.com/kiosk-editor/221111_lgxb/template/lgxb_frame2_1668125238979.png",
  frame3: "https://hashsnap-static.s3.ap-northeast-2.amazonaws.com/kiosk-editor/221111_lgxb/template/lgxb_frame3_1668125238987.png",
}

const assetsMap: Map<string, (HTMLImageElement|null)> = new Map();
const assetsLoad = Object.entries(assets).map(async (assets) => {
  const [name, data] = assets;
  const img = await loadImage(data) as HTMLImageElement;
  assetsMap.set(name, img);
  return [name, img];
});
await Promise.all(assetsLoad);

const img = assetsMap.get('photo3') as HTMLImageElement;
const frame1 = assetsMap.get('frame1') as HTMLImageElement;
const frame2 = assetsMap.get('frame2') as HTMLImageElement;
const frame3 = assetsMap.get('frame3') as HTMLImageElement;

const canvas = Object.assign(document.createElement('canvas'), {}) as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
app.appendChild(canvas);

canvas.width = 1200;
canvas.height = 1800;
ctx.drawImage(frame1, 0, 0, canvas.width, canvas.height);

const photoSize = { width: 932, height: 952, x: 134, y: 509 };
const icanvas = Object.assign(document.createElement('canvas'), { width: photoSize.width, height: photoSize.height });
const ictx = icanvas.getContext('2d') as CanvasRenderingContext2D;
const or = icanvas.width / icanvas.height;
const ir = img.width / img.height;
let align = '';
let iwidth = 0;
let iheight = 0;
let ix = 0;
let iy = 0;

let minX = 0;
let minY = 0;
let maxX = 0;
let maxY = 0;

if (or < ir) { // 높이 Fill
  align = 'vertical';
  iwidth = (img.width * icanvas.height) / img.height;
  iheight = icanvas.height;
  ix = (icanvas.width - iwidth) / 2;
  iy = 0;
  maxX = icanvas.width - iwidth;
  ictx.drawImage(img, ix, 0, iwidth, iheight);
}
if (or > ir) { // 너비 Fill
  align = 'horizontal';
  iwidth = icanvas.width;
  iheight = (img.height * icanvas.width) / img.width;
  ix = 0;
  iy = (icanvas.height - iheight) / 2;
  maxY = icanvas.height - iheight;
  ictx.drawImage(img, 0, iy, iwidth, iheight);
} 

ctx.drawImage(icanvas, photoSize.x, photoSize.y, icanvas.width, icanvas.height);

addDragControl(canvas, {
  down: (ev) => {
    // console.log('pointer down', ev);
    return true;
  },
  move: (ev) => {
    if (align === 'vertical') {
      ix += ev.dx;
      if (ix >= minX) ix = minX;
      if (ix <= maxX) ix = maxX;
      ictx.drawImage(img, ix, 0, iwidth, iheight);
      ctx.clearRect(photoSize.x, photoSize.y, icanvas.width, icanvas.height);
      ctx.drawImage(icanvas, photoSize.x, photoSize.y, icanvas.width, icanvas.height);
    } 
    if (align === 'horizontal') {
      iy += ev.dy;
      if (iy >= minY) iy = minY;
      if (iy <= maxY) iy = maxY;
      ictx.drawImage(img, 0, iy, iwidth, iheight);
      ctx.clearRect(photoSize.x, photoSize.y, icanvas.width, icanvas.height);
      ctx.drawImage(icanvas, photoSize.x, photoSize.y, icanvas.width, icanvas.height);
    }
  },
  up: (ev) => {},
})

addTouchControl(canvas, {
  down: (ev) => {
    // console.log('touch start', ev)
    return true;
  },
  move: (ev) => {
    if (align === 'vertical') {
      ix += ev.dx;
      if (ix >= minX) ix = minX;
      if (ix <= maxX) ix = maxX;
      ictx.drawImage(img, ix, 0, iwidth, iheight);
      ctx.clearRect(photoSize.x, photoSize.y, icanvas.width, icanvas.height);
      ctx.drawImage(icanvas, photoSize.x, photoSize.y, icanvas.width, icanvas.height);
    } 
    if (align === 'horizontal') {
      iy += ev.dy;
      if (iy >= minY) iy = minY;
      if (iy <= maxY) iy = maxY;
      ictx.drawImage(img, 0, iy, iwidth, iheight);
      ctx.clearRect(photoSize.x, photoSize.y, icanvas.width, icanvas.height);
      ctx.drawImage(icanvas, photoSize.x, photoSize.y, icanvas.width, icanvas.height);
    }
  },
  up: (ev) => {},
})


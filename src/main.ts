import './style.css'
import addDragControl from './drag-control';
import { loadImage } from './utils';
import { FramePhoto } from './transform';

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

const img = assetsMap.get('photo4') as HTMLImageElement;
const frame1 = assetsMap.get('frame1') as HTMLImageElement;
const frame2 = assetsMap.get('frame2') as HTMLImageElement;
const frame3 = assetsMap.get('frame3') as HTMLImageElement;

const frameCanvas = [
  frame1,
  frame2,
  frame3,
].map((frame) => {
  const photoConfig = { img, width: 932, height: 952, x: 134, y: 509 };
  const framePhoto = new FramePhoto(photoConfig);
  const canvas = Object.assign(document.createElement('canvas'), {width: 1200, height: 1800, style: 'width: 300px;'}) as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(framePhoto.canvas, photoConfig.x, photoConfig.y, photoConfig.width, photoConfig.height);

  addDragControl(canvas, {
    down: () => { return true },
    move: (ev) => {
      framePhoto.drawImage({x: ev.dx, y: ev.dy});
      ctx.clearRect(photoConfig.x, photoConfig.y, photoConfig.width, photoConfig.height);
      ctx.drawImage(framePhoto.canvas, photoConfig.x, photoConfig.y, photoConfig.width, photoConfig.height);
    },
    up: () => {},
  });
  return canvas;
});
frameCanvas.forEach(canvas => app.appendChild(canvas));

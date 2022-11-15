import './style.css'
import TransformControl, { CanvasComponent } from './transform-control';
import { loadImage } from './utils';

const app = document.getElementById('app') as HTMLDivElement;
const assets = {
  photo3: "https://media.hashsn.app/uploaded-posts/de575236-7361-45a0-8065-1b2c2906dda8.jpg",
  photo4: "https://media.hashsn.app/uploaded-posts/fb740d1c-4238-4d2d-9f8a-90094fd76ddc.jpg",
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
const canvasComponent = new CanvasComponent(img, { width: 960, height: 960 })
app.appendChild(canvasComponent.canvas);

const control = new TransformControl(canvasComponent);
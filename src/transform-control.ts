import addDragControl from "./drag-control";
import addTouchControl from "./touch-control";

export class CanvasComponent {
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  img!: HTMLImageElement;

  align!: 'vertical'|'horizontal'|'default';
  originalRatio: number = 0;
  transformRatio: number = 0;

  x: number = 0;
  y: number = 0;
  width!: number;
  height!: number;
  constructor(img: HTMLImageElement, options: {width: number; height: number;}) {
    this.img = img;
    this.canvas = document.createElement('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvas.width = options.width;
    this.canvas.height = options.height;

    this.setRatio();
    this.transformAlign();
    this.transform();
    this.drawImage({x: 0, y: 0});
  }
  get canvasSize() {
    return {
      width: this.canvas.width, 
      height: this.canvas.height
    }
  }
  get imageSize() {
    return {
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      min: {
        x: 0,
        y: 0,
      },
      max: {
        x: this.align === 'horizontal' ? 0 : this.canvas.width - this.width,
        y: this.align === 'vertical' ? 0 : this.canvas.height - this.height,
      }
    }
  }
  private setRatio() {
    this.originalRatio = this.canvas.width / this.canvas.height;
    this.transformRatio = this.img.width / this.img.height;
  }
  private transformAlign() {
    if (this.originalRatio < this.transformRatio) {
      this.align = 'vertical'
    } 
    if (this.originalRatio > this.transformRatio) {
      this.align = 'horizontal'
    }
    if (this.originalRatio === this.transformRatio) {
      this.align = 'default';
    }
  }
  private transform() {
    if (this.align === 'vertical') {
      this.width = (this.img.width * this.canvas.width) / this.img.height;
      this.height = this.canvas.height;
      this.x = (this.canvas.width - this.width) / 2;
      this.y = 0;
    }
    if (this.align === 'horizontal') {
      this.width = this.canvas.width;
      this.height = (this.img.height * this.canvas.width) / this.img.width;
      this.x = 0;
      this.y = (this.canvas.height - this.height) / 2;
    }
    if (this.align === 'default') {
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.x = 0;
      this.y = 0;
    }
  }
  drawImage(position: {x: number; y: number}) {
    const {min, max} = this.imageSize;
    if (this.align === 'vertical') {
      this.x += position.x;
      this.x >= min.x && (this.x = min.x);
      this.x <= max.x && (this.x = max.x);
    }
    if (this.align === 'horizontal') {
      this.y += position.y;
      this.y >= min.y && (this.y = min.y);
      this.y <= max.y && (this.y = max.y);
    }
    this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  clearRect() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}

class TransformControl {
  interaction!: 'pointer' | 'touch';
  items: CanvasComponent[] = [];

  dragListener: (() => void) | null = null;
  touchListener: (() => void) | null = null;
  constructor(target: CanvasComponent) {
    addDragControl(target.canvas, {
      down: (ev) => {
        console.log(ev)
        return true
      },
      move: (ev, payload) => {
        target.clearRect();
        target.drawImage({x: ev.dx, y: ev.dy});
      },
      up: (ev) => {},
    });
    addTouchControl(target.canvas, {
      down: (ev) => {
        return true
      },
      move: (ev) => {
        target.clearRect();
        target.drawImage({x: ev.dx, y: ev.dy});
      },
      up: (ev) => {},
    })
  }
  push(item: CanvasComponent) {
    this.items.push(item);
  }
}

export default TransformControl;
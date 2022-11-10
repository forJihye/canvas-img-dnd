export class CanvasComponent {
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  img!: HTMLImageElement;

  originalRatio: number = 0;
  transformRatio: number = 0;
  transformMode!: 'vertical'|'horizontal'|'none';

  width!: number;
  height!: number;
  x: number = 0;
  y: number = 0;
  constructor(img: HTMLImageElement, options: {width: number; height: number;}) {
    this.img = img;
    this.canvas = document.createElement('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvas.width = options.width;
    this.canvas.height = options.height;

    this.setRatio();
    this.setTransformMode();
    this.setImageSize();
    this.drawImage({x: 0, y: 0});
  }
  get canvasSize() {
    return {width: this.canvas.width, height: this.canvas.height}
  }
  get imageSize() {
    return {
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y
    }
  }
  private setRatio() {
    this.originalRatio = this.canvas.width / this.canvas.height;
    this.transformRatio = this.img.width / this.img.height;
  }
  private setTransformMode() {
    if (this.originalRatio < this.transformRatio) {
      this.transformMode = 'vertical'
    } 
    if (this.originalRatio > this.transformRatio) {
      this.transformMode = 'horizontal'
    }
    if (this.originalRatio === this.transformRatio) {
      this.transformMode = 'none';
    }
  }
  private setImageSize() {
    if (this.transformMode === 'vertical') {
      this.width = (this.img.width * this.canvas.width) / this.img.height;
      this.height = this.canvas.height;
      this.x = (this.canvas.width - this.width) / 2;
      this.y = 0;
    }
    if (this.transformMode === 'horizontal') {
      this.width = this.canvas.width;
      this.height = (this.img.height * this.canvas.width) / this.img.width;
      this.x = 0;
      this.y = (this.canvas.height - this.height) / 2;
    }
    if (this.transformMode === 'none') {
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.x = 0;
      this.y = 0;
    }
  }
  drawImage(position: {x: number; y: number}) {
    this.x += position.x;
    this.y += position.y;
    console.log(this.x, this.y, this.width, this.height)
    this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

class TransformControl {
  interaction!: 'pointer' | 'touch';
  constructor() {
    
  }
}


export default TransformControl;
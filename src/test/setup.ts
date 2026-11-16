// jsdom has no layout engine, ResizeObserver or <dialog>.showModal; stub the minimum the app touches.
if (typeof window !== 'undefined') {
  class RO { observe() {} unobserve() {} disconnect() {} }
  (globalThis as any).ResizeObserver = (globalThis as any).ResizeObserver ?? RO;
  const D = (globalThis as any).HTMLDialogElement;
  if (D && !D.prototype.showModal) { D.prototype.showModal = function () { this.setAttribute('open', ''); }; D.prototype.close = function () { this.removeAttribute('open'); }; }
}

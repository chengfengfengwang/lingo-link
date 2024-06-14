import mitt from 'mitt';

type Events = {
  showCard: {text:string, domRect:DOMRect};
  hideCard: void
};

export const emitter = mitt<Events>();

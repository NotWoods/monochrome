import { FileDropEvent } from 'file-drop-element';

declare global {
  interface HTMLElementEventMap {
    filedrop: FileDropEvent;
  }
}

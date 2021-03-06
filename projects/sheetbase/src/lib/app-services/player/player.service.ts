import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Howl } from 'howler';

import { Audio, Bundle } from '@sheetbase/models';

type PlayerType = 'audio' | 'radio' | 'video';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  // system
  private audio: Howl;

  // data
  bundle: Bundle; // album, playlist
  items: Audio[] = []; // songs
  itemIndex = 0;

  // timing
  duration = 0;
  time = 0;
  seekBarValue = 0;

  // misc
  available = false;
  type: PlayerType = 'audio';
  nextItemQueued = false;

  constructor(
    private toastController: ToastController,
  ) {
    this.init();
  }

  private init() {
    const blankAudio = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    // init audio
    this.audio = new Howl({
      src: [blankAudio],
    });
    // init items
    this.items.push({
      $key: '__',
      title: 'Welcome!',
      authors: '--' as any,
      src: blankAudio,
    });
  }

  private playAudio(urls: string[]) {
    this.audio.fade(1, 0, 1000);
    setTimeout(() => {
      this.audio.stop();
      // replace audio
      this.audio = new Howl({
        src: urls,
        onloaderror: () => this.available = false,
        onload: () => {
          this.available = true;
          this.audio.play();
        },
        onplay: () => {
          this.duration = this.audio.duration();
          return this.playingStep();
        },
      });
    }, 1000);
  }

  private playingStep() {
    // update timing
    this.time = this.audio.seek() as number;
    this.seekBarValue = !!this.duration ? Math.ceil((this.time * 100) / this.duration) : 0;
    // autoplay next song
    if (
      !this.nextItemQueued &&
      this.time > (this.duration - 10)
    ) {
      this.nextItemQueued = true;
      const nextIndex = !!this.nextItem() ? this.itemIndex + 1 : 0;
      // notify
      this.playNextNotifier(this.items[nextIndex]);
      // play next song
      setTimeout(() => {
        this.play(this.items, nextIndex, this.bundle, this.type);
        // reset checker
        this.nextItemQueued = false;
      }, 11000);
    }
    // continue steping
    if (this.audio.playing()) {
      setTimeout(() => this.playingStep(), 1000);
    }
  }

  private async playNextNotifier(item: Audio) {
    const toast = await this.toastController.create({
      header: 'Play next: ' + item.title,
      duration: 10000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'OK',
    });
    return await toast.present();
  }

  currentItem(): any {
    return this.items[this.itemIndex];
  }

  prevItem(): any {
    return this.items[this.itemIndex - 1];
  }

  nextItem(): any {
    return this.items[this.itemIndex + 1];
  }

  playing() {
    return !!this.audio ? this.audio.playing() : false;
  }

  play(
    items: Audio[],
    itemIndex = 0,
    bundle?: Bundle,
    type: PlayerType = 'audio',
  ) {
    this.items = items;
    this.itemIndex = itemIndex;
    this.bundle = bundle;
    this.type = type;
    // play audio
    const item = items[itemIndex];
    const srcs = [];
    if (typeof item.src === 'string') {
      srcs.push(item.src);
    } else {
      for (const key of Object.keys(item.src)) {
        srcs.push(item.src[key]);
      }
    }
    return this.playAudio(srcs);
  }

  togglePlay() {
    if (!this.audio.playing()) {
      this.audio.fade(0, 1, 500);
      this.audio.play();
    } else {
      this.audio.fade(1, 0, 500);
      setTimeout(() => this.audio.pause(), 500);
    }
  }

  togglePrev() { // NOTE: only for type of list
    return this.play(this.items, this.itemIndex - 1, this.bundle, this.type);
  }

  toggleNext() {
    return this.play(this.items, this.itemIndex + 1, this.bundle, this.type);
  }

  seek() {
    this.audio.seek((this.seekBarValue * this.duration) / 100);
  }

  formatTime(secondsNumber: number = 0) {
    if (!!secondsNumber || secondsNumber === 0) {
      const minutes = Math.floor(secondsNumber / 60) || 0;
      const seconds = Math.floor(secondsNumber - minutes * 60) || 0;
      return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    } else {
      return '--:--';
    }
  }

}

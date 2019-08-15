import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import {
  CacheRefresher,
  LocalstorageConfigs,
  LocalstorageIterateHandler,
  LocalstorageIterateKeysHandler,
} from '@sheetbase/client';

import { SheetbaseService } from '../sheetbase/sheetbase.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor(private Sheetbase: SheetbaseService) {}

  instance(storageConfigs: LocalstorageConfigs) {
    return this.Sheetbase.cache().instance(storageConfigs);
  }

  cacheTime(cacheTime: number) {
    return this.Sheetbase.cache().cacheTime(cacheTime);
  }

  set<Data>(key: string, data: Data, expiration?: number) {
    return from(this.Sheetbase.cache().set(key, data, expiration));
  }

  get<Data>(key: string, always = false) {
    return from(this.Sheetbase.cache().get<Data>(key, always));
  }

  getRefresh<Data>(key: string, expiration?: number, refresher?: CacheRefresher<Data>) {
    return from(this.Sheetbase.cache().getRefresh<Data>(key, expiration, refresher));
  }

  iterate<Data>(handler: LocalstorageIterateHandler<Data>) {
    return from(this.Sheetbase.cache().iterate(handler));
  }

  iterateKeys(handler: LocalstorageIterateKeysHandler) {
    return from(this.Sheetbase.cache().iterateKeys(handler));
  }

  remove(key: string) {
    return from(this.Sheetbase.cache().remove(key));
  }

  removeBulk(keys: string[]) {
    return from(this.Sheetbase.cache().removeBulk(keys));
  }

  removeByPrefix(prefix: string) {
    return from(this.Sheetbase.cache().removeByPrefix(prefix));
  }

  removeBySuffix(suffix: string) {
    return from(this.Sheetbase.cache().removeBySuffix(suffix));
  }

  flush() {
    return from(this.Sheetbase.cache().flush());
  }

  flushExpired() {
    return from(this.Sheetbase.cache().flushExpired());
  }

}

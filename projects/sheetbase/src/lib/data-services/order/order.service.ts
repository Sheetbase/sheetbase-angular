import { Injectable } from '@angular/core';

import { Order } from '@sheetbase/models';
import { Filter, DatabaseMethodOptions } from '@sheetbase/client';

import { AppService } from '../../app-services/app/app.service';
import { ApiService } from '../../sheetbase-services/api/api.service';
import { DatabaseService } from '../../sheetbase-services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private sheet = 'orders';

  constructor(
    private App: AppService,
    private Api: ApiService,
    private Database: DatabaseService,
  ) {}

  items(filter?: Filter, options: DatabaseMethodOptions = {}) {
    return this.Database.items<Order>(this.sheet, filter, options);
  }

  item(finder: string | Filter, options: DatabaseMethodOptions = {}) {
    return this.Database.item<Order>(this.sheet, finder, options);
  }

  itemsDraft(options: DatabaseMethodOptions = {}) {
    return this.Database.itemsDraft<Order>(this.sheet, options);
  }

  itemsPublished(options: DatabaseMethodOptions = {}) {
    return this.Database.itemsPublished<Order>(this.sheet, options);
  }

  itemsArchived(options: DatabaseMethodOptions = {}) {
    return this.Database.itemsArchived<Order>(this.sheet, options);
  }

  itemsStageNew(options: DatabaseMethodOptions = {}) {
    return this.itemsByStage('new', options);
  }

  itemsStageConfirmed(options: DatabaseMethodOptions = {}) {
    return this.itemsByStage('confirmed', options);
  }

  itemsStageDelivering(options: DatabaseMethodOptions = {}) {
    return this.itemsByStage('delivering', options);
  }

  itemsStageDone(options: DatabaseMethodOptions = {}) {
    return this.itemsByStage('done', options);
  }

  itemsStageCancelled(options: DatabaseMethodOptions = {}) {
    return this.itemsByStage('cancelled', options);
  }

  itemsByType(type: string, options: DatabaseMethodOptions = {}) {
    return this.Database.itemsByType<Order>(this.sheet, type, options);
  }

  itemsByTypeDefault(options: DatabaseMethodOptions = {}) {
    return this.Database.itemsByTypeDefault<Order>(this.sheet, options);
  }

  itemsByStage(
    stage: 'new' | 'confirmed' | 'delivering' | 'done' | 'cancelled',
    options: DatabaseMethodOptions = {},
  ) {
    return this.Database.items<Order>(
      this.sheet,
      (item: Order) => (
        !!item.stage &&
        item.stage === stage
      ),
      options,
    );
  }

  itemsByUid(uid: string, options: DatabaseMethodOptions = {}) {
    return this.Database.items<Order>(
      this.sheet,
      (item: Order) => (
        !!item.uid &&
        item.uid === uid
      ),
      options,
    );
  }

  itemsByEmail(email: string, options: DatabaseMethodOptions = {}) {
    return this.Database.items<Order>(
      this.sheet,
      (item: Order) => (
        !!item.email &&
        item.email === email
      ),
      options,
    );
  }

  itemsByMetaExists(metaKey: string, options: DatabaseMethodOptions = {}) {
    return this.Database.itemsByMetaExists<Order>(this.sheet, metaKey, options);
  }

  itemsByMetaEquals(metaKey: string, equalTo: string, options: DatabaseMethodOptions = {}) {
    return this.Database.itemsByMetaEquals<Order>(this.sheet, metaKey, equalTo, options);
  }

  add(item: Order) {
    return this.Database.add(this.sheet, null, item);
  }

  addExtra(item: Order, endpoint = '/app/order') {
    return this.Api.put(endpoint, {}, {
      host: this.App['host'],
      order: item,
    });
  }

  clearCachedAll() {
    return this.Database.clearCachedAll(this.sheet);
  }

  clearCachedItem(key: string) {
    return this.Database.clearCachedItem(this.sheet, key);
  }

}

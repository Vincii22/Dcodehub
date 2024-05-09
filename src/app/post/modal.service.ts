
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
 providedIn: 'root'
})
export class ModalService {
 private isOpenSource = new BehaviorSubject<boolean>(false);
 isOpen$ = this.isOpenSource.asObservable();

 open() {
    this.isOpenSource.next(true);
 }

 close() {
    this.isOpenSource.next(false);
 }
}
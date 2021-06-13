import { AfterViewInit, Component, OnInit } from '@angular/core';

import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import { UserService } from '../services/user.service';
import { User } from '../interfaces/users.interfaces';
 
export class UserDatasourceComponent implements DataSource<User> { 

  

  private lessonsSubject = new BehaviorSubject<User[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();


  constructor(private userService: UserService) { }



  loadLessons(courseId:number,
    filter:string,
    sortDirection:string,
    pageIndex:number,
    pageSize:number) {

            this.loadingSubject.next(true);

            this.userService.getOnlyUsers( pageIndex ,  pageSize, filter).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(lessons => {
              console.log('pageSize='+pageSize);
              console.log('pageIndex='+pageIndex);
              console.log('lessons='+JSON.stringify(lessons));
              return this.lessonsSubject.next(lessons); 
            });

            }


  connect(collectionViewer: CollectionViewer): Observable<User[] |  User[]> {
    console.log("Connecting data source");
    return this.lessonsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.lessonsSubject.complete();
    this.loadingSubject.complete();
  }

}

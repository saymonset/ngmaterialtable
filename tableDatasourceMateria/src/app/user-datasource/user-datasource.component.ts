import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import { UserService } from '../services/user.service';
import { User } from '../interfaces/users.interfaces';
import { MatPaginator } from '@angular/material/paginator';
 
export class UserDatasourceComponent implements DataSource<User> { 

  

  private lessonsSubject = new BehaviorSubject<User[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  public data : User[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private userService: UserService) { }



  loadLessons(courseId:number,
    filter:string,
    sortDirection:string,
    page:number,
    per_page:number) {

            this.loadingSubject.next(true);
// page: number, per_page:number
            this.userService.getOnlyUsers( page ,  per_page, filter).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(lessons => {
              // console.log('pageSize='+per_page);
              // console.log('page='+page);
              // console.log('lessons='+JSON.stringify(lessons));
              this.data = lessons;
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

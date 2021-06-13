import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import {Observable, BehaviorSubject, of, merge} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, finalize, tap} from "rxjs/operators";
import { UserService } from '../services/user.service';
import { User, UserData } from '../interfaces/users.interfaces';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { UserDatasourceComponent } from '../user-datasource/user-datasource.component';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { fromEvent } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabla-datasource',
  templateUrl: './tabla-datasource.component.html',
  styleUrls: ['./tabla-datasource.component.css']
})
export class TablaDatasourceComponent implements OnInit {


  dataSource!: UserDatasourceComponent;
  displayedColumns: string[] = [ 'id','email', 'first_name', 'last_name', 'avatar'];

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);

  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort();

  @ViewChild('input', { static: true }) input!: ElementRef;

  data! : UserData
  users:        User[] = [];
  offset: number=0;

  courseId:number=0;
    filter:string='';
    sortEmail:string='asc';
    pageIndex:number=2;
    pageSize:number=2;

  @Output() page = new EventEmitter<PageEvent>();
 

  constructor(private userService: UserService) { 

    }

   

ngOnInit(): void {

// this.course = this.route.snapshot.data["course"];
this.dataSource = new UserDatasourceComponent(this.userService);
this.dataSource.loadLessons(0, '', 'asc', 0, 3);

}


ngAfterViewInit(): void {

console.log('xx='+this.paginator.pageIndex, this.paginator.pageSize);

//this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

fromEvent(this.input.nativeElement,'keyup')
.pipe(
debounceTime(150),
distinctUntilChanged(),
tap(() => {
this.paginator.pageIndex = 0;
 console.log('pasandddoooooooooooooo');
this.loadLessonsPage();
})
)
.subscribe();

// merge(this.sort?.sortChange, this.paginator.page)
// .pipe(
// tap(() => this.loadLessonsPage())
// )
// .subscribe();


}



loadLessonsPage() {
this.dataSource.loadLessons(
0,  '', 'email', 
this.paginator.pageIndex, this.paginator.pageSize);
}

getNext(event: PageEvent) {
this.offset = event.pageSize * event.pageIndex
console.log(this.offset);
// call your api function here with the offset
}

onRowClicked(row:User){
console.log('Row clicked: ', row);
}

onPageFired(event){
  let {pageIndex,pageSize} = event;
  console.log(event);
  console.log({pageIndex,pageSize});
  // page: number, per_page:number
  this.dataSource.loadLessons(0, '', 'asc', pageSize, pageIndex);
}

}

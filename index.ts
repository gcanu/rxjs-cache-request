import { Observable, of } from 'rxjs'; 
import { catchError, map, shareReplay, switchMap,  takeUntil } from 'rxjs/operators';


const source = new Observable<string>(subscriber => {
  setTimeout(() => {
    subscriber.next('data '+Date.now());
    //subscriber.error('erreur '+Date.now());
    subscriber.complete();
  }, 1000);
});

class DataService {
  cache$: Observable<string>;

  getData(refresh: boolean = false): Observable<string> {
    if(refresh) {
      this.cache$ = null;
    }

    if(!this.cache$) {
      this.cache$ = this.requestData().pipe(
        catchError(err => {
          throw new Error(err);
        }),
        shareReplay(1),
      );
    }

    return this.cache$;
  }

  private requestData(): Observable<string> {
    return source;
  }
}

// test
const service = new DataService();
service.getData().subscribe((data) => console.log(data));

setTimeout(() => {
  service.getData().subscribe((data) => console.log(data));
}, 2000);

setTimeout(() => {
  service.getData(true).subscribe((data) => console.log(data));
}, 4000);
